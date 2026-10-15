"""Async MongoDB Manager for PCOS Saathi / SakhiCare.

Powered by Motor (async driver for MongoDB) and PyMongo.
Provides connection pooling, health checks, automatic index creation,
and resilient offline fallback handling.
"""
from __future__ import annotations

import re
import time
from typing import Any, Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

from .config import settings
from .logging import logger


def mask_mongo_uri(uri: str) -> str:
    """Mask credentials in MongoDB connection string for safe logging and client display."""
    if not uri:
        return ""
    # Matches mongodb://user:pass@host or mongodb+srv://user:pass@host
    return re.sub(r"://([^:@]+):([^@]+)@", r"://\1:******@", uri)


class MongoDBManager:
    """Singleton MongoDB connection and collection manager."""

    def __init__(self) -> None:
        self.client: Optional[AsyncIOMotorClient] = None
        self.db: Optional[AsyncIOMotorDatabase] = None
        self.is_connected: bool = False
        self.last_error: Optional[str] = None
        self.uri: str = settings.MONGODB_URI
        self.db_name: str = settings.MONGODB_DB_NAME
        self.timeout_ms: int = settings.MONGODB_TIMEOUT_MS

    async def connect(
        self,
        uri: Optional[str] = None,
        db_name: Optional[str] = None,
        timeout_ms: Optional[int] = None,
    ) -> bool:
        """Attempt to connect and verify MongoDB ping."""
        target_uri = uri or self.uri
        target_db = db_name or self.db_name
        target_timeout = timeout_ms or self.timeout_ms

        self.uri = target_uri
        self.db_name = target_db
        self.timeout_ms = target_timeout

        logger.info("Attempting MongoDB connection to [%s], database [%s]", mask_mongo_uri(target_uri), target_db)

        try:
            # Disconnect existing client if any
            if self.client:
                self.client.close()

            # Initialize new Motor client
            self.client = AsyncIOMotorClient(
                target_uri,
                serverSelectionTimeoutMS=target_timeout,
                connectTimeoutMS=target_timeout,
                socketTimeoutMS=target_timeout,
            )

            # Test connection with ping command
            start_time = time.perf_counter()
            await self.client.admin.command("ping")
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

            self.db = self.client[target_db]
            self.is_connected = True
            self.last_error = None

            logger.info("MongoDB connected successfully to [%s] (ping: %sms)", target_db, latency_ms)

            # Create default collection indexes
            await self._ensure_indexes()
            return True

        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as exc:
            self.is_connected = False
            self.last_error = str(exc)
            logger.warning(
                "MongoDB connection failed to [%s]: %s (system will operate in resilient offline cache mode)",
                mask_mongo_uri(target_uri),
                exc,
            )
            return False

    async def disconnect(self) -> None:
        """Close MongoDB connection gracefully."""
        if self.client:
            logger.info("Closing MongoDB connection")
            self.client.close()
            self.client = None
            self.db = None
            self.is_connected = False

    async def _ensure_indexes(self) -> None:
        """Create indexes on collections to optimize queries."""
        if not self.is_connected or self.db is None:
            return
        try:
            # 1. Health Entries
            await self.db.health_entries.create_index("id", unique=True)
            await self.db.health_entries.create_index("created_at")

            # 2. Cycle Entries
            await self.db.cycle_entries.create_index("id", unique=True)
            await self.db.cycle_entries.create_index("start_date")

            # 3. Doctor Summaries
            await self.db.doctor_summaries.create_index("id", unique=True)

            # 4. Insights
            await self.db.insights.create_index("id", unique=True)

            logger.info("MongoDB collection indexes verified")
        except Exception as exc:
            logger.warning("Could not create MongoDB indexes: %s", exc)

    async def get_status(self) -> Dict[str, Any]:
        """Return real-time connection status, database statistics, and collection counts."""
        if not self.is_connected or not self.client or self.db is None:
            return {
                "connected": False,
                "db_name": self.db_name,
                "uri": mask_mongo_uri(self.uri),
                "latency_ms": None,
                "error": self.last_error or "Not connected to MongoDB service",
                "collections": {
                    "health_entries": 0,
                    "cycle_entries": 0,
                    "doctor_summaries": 0,
                    "insights": 0,
                },
            }

        try:
            start_time = time.perf_counter()
            await self.client.admin.command("ping")
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

            health_count = await self.db.health_entries.count_documents({})
            cycle_count = await self.db.cycle_entries.count_documents({})
            summary_count = await self.db.doctor_summaries.count_documents({})
            insights_count = await self.db.insights.count_documents({})

            return {
                "connected": True,
                "db_name": self.db_name,
                "uri": mask_mongo_uri(self.uri),
                "latency_ms": latency_ms,
                "error": None,
                "collections": {
                    "health_entries": health_count,
                    "cycle_entries": cycle_count,
                    "doctor_summaries": summary_count,
                    "insights": insights_count,
                },
            }
        except Exception as exc:
            self.is_connected = False
            self.last_error = str(exc)
            return {
                "connected": False,
                "db_name": self.db_name,
                "uri": mask_mongo_uri(self.uri),
                "latency_ms": None,
                "error": str(exc),
                "collections": {
                    "health_entries": 0,
                    "cycle_entries": 0,
                    "doctor_summaries": 0,
                    "insights": 0,
                },
            }

    @property
    def health_entries(self):
        if not self.is_connected or self.db is None:
            raise ConnectionError("MongoDB is not connected. Operation unavailable.")
        return self.db.health_entries

    @property
    def cycle_entries(self):
        if not self.is_connected or self.db is None:
            raise ConnectionError("MongoDB is not connected. Operation unavailable.")
        return self.db.cycle_entries

    @property
    def doctor_summaries(self):
        if not self.is_connected or self.db is None:
            raise ConnectionError("MongoDB is not connected. Operation unavailable.")
        return self.db.doctor_summaries

    @property
    def insights(self):
        if not self.is_connected or self.db is None:
            raise ConnectionError("MongoDB is not connected. Operation unavailable.")
        return self.db.insights


# Singleton instance
mongo_manager = MongoDBManager()
