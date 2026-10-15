"""MongoDB REST Endpoints for PCOS Saathi / Luna Her.

Supports CRUD, dynamic connection configuration, health checks,
and full-vault synchronization between local storage and MongoDB.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

from ..core.database import mongo_manager
from ..core.logging import logger

router = APIRouter(prefix="/api/db", tags=["MongoDB Integration"])


# -----------------------------------------------------------------------------
# Request & Response Schemas
# -----------------------------------------------------------------------------
class MongoConfigPayload(BaseModel):
    uri: str = Field(..., description="MongoDB connection string (e.g. mongodb://localhost:27017 or mongodb+srv://...)")
    db_name: Optional[str] = Field(default="luna_her_db", description="Database name")
    timeout_ms: Optional[int] = Field(default=3000, description="Connection timeout in ms")


class SyncPayload(BaseModel):
    health_entries: List[Dict[str, Any]] = Field(default_factory=list)
    cycle_entries: List[Dict[str, Any]] = Field(default_factory=list)
    doctor_summaries: List[Dict[str, Any]] = Field(default_factory=list)
    insights: List[Dict[str, Any]] = Field(default_factory=list)


# -----------------------------------------------------------------------------
# Database Status & Configuration
# -----------------------------------------------------------------------------
@router.get("/status")
async def get_db_status():
    """Check MongoDB connection status, live latency, and collection document counts."""
    return await mongo_manager.get_status()


@router.post("/configure")
async def configure_db(payload: MongoConfigPayload):
    """Test and configure MongoDB connection dynamically."""
    success = await mongo_manager.connect(
        uri=payload.uri,
        db_name=payload.db_name,
        timeout_ms=payload.timeout_ms,
    )
    status_data = await mongo_manager.get_status()
    if not success:
        return {
            "success": False,
            "message": f"Could not connect to MongoDB: {status_data.get('error')}",
            "status": status_data,
        }
    return {
        "success": True,
        "message": f"Successfully connected to MongoDB database [{status_data['db_name']}]",
        "status": status_data,
    }


# -----------------------------------------------------------------------------
# Health Entries CRUD
# -----------------------------------------------------------------------------
@router.get("/health-entries")
async def get_health_entries(limit: int = Query(default=100, ge=1, le=500)):
    """Fetch health and symptom entries stored in MongoDB."""
    if not mongo_manager.is_connected:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is offline or not connected",
        )
    cursor = mongo_manager.health_entries.find({}, {"_id": 0}).sort("created_at", -1).limit(limit)
    entries = await cursor.to_list(length=limit)
    return {"entries": entries, "count": len(entries)}


@router.post("/health-entries")
async def save_health_entry(entry: Dict[str, Any]):
    """Upsert a health entry into MongoDB."""
    if not mongo_manager.is_connected:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is offline or not connected",
        )
    entry_id = entry.get("id")
    if not entry_id:
        raise HTTPException(status_code=400, detail="Health entry must have an 'id' field")

    await mongo_manager.health_entries.update_one(
        {"id": entry_id},
        {"$set": entry},
        upsert=True,
    )
    return {"success": True, "id": entry_id, "message": "Health entry saved to MongoDB"}


@router.delete("/health-entries/{entry_id}")
async def delete_health_entry(entry_id: str):
    """Delete a health entry from MongoDB."""
    if not mongo_manager.is_connected:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="MongoDB is offline")
    result = await mongo_manager.health_entries.delete_one({"id": entry_id})
    return {"success": True, "deleted_count": result.deleted_count}


# -----------------------------------------------------------------------------
# Cycle Entries CRUD
# -----------------------------------------------------------------------------
@router.get("/cycle-entries")
async def get_cycle_entries(limit: int = Query(default=100, ge=1, le=500)):
    """Fetch menstrual cycle and period entries stored in MongoDB."""
    if not mongo_manager.is_connected:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="MongoDB is offline")
    cursor = mongo_manager.cycle_entries.find({}, {"_id": 0}).sort("start_date", -1).limit(limit)
    entries = await cursor.to_list(length=limit)
    return {"entries": entries, "count": len(entries)}


@router.post("/cycle-entries")
async def save_cycle_entry(entry: Dict[str, Any]):
    """Upsert a menstrual cycle entry into MongoDB."""
    if not mongo_manager.is_connected:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="MongoDB is offline")
    entry_id = entry.get("id")
    if not entry_id:
        raise HTTPException(status_code=400, detail="Cycle entry must have an 'id' field")

    await mongo_manager.cycle_entries.update_one(
        {"id": entry_id},
        {"$set": entry},
        upsert=True,
    )
    return {"success": True, "id": entry_id, "message": "Cycle entry saved to MongoDB"}


@router.delete("/cycle-entries/{entry_id}")
async def delete_cycle_entry(entry_id: str):
    """Delete a cycle entry from MongoDB."""
    if not mongo_manager.is_connected:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="MongoDB is offline")
    result = await mongo_manager.cycle_entries.delete_one({"id": entry_id})
    return {"success": True, "deleted_count": result.deleted_count}


# -----------------------------------------------------------------------------
# Doctor Summaries CRUD
# -----------------------------------------------------------------------------
@router.get("/doctor-summaries")
async def get_doctor_summaries(limit: int = Query(default=50, ge=1, le=200)):
    """Fetch saved clinician summaries stored in MongoDB."""
    if not mongo_manager.is_connected:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="MongoDB is offline")
    cursor = mongo_manager.doctor_summaries.find({}, {"_id": 0}).sort("generated_at", -1).limit(limit)
    summaries = await cursor.to_list(length=limit)
    return {"summaries": summaries, "count": len(summaries)}


@router.post("/doctor-summaries")
async def save_doctor_summary(summary: Dict[str, Any]):
    """Upsert a doctor summary into MongoDB."""
    if not mongo_manager.is_connected:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="MongoDB is offline")
    summary_id = summary.get("id")
    if not summary_id:
        raise HTTPException(status_code=400, detail="Doctor summary must have an 'id' field")

    await mongo_manager.doctor_summaries.update_one(
        {"id": summary_id},
        {"$set": summary},
        upsert=True,
    )
    return {"success": True, "id": summary_id, "message": "Doctor summary saved to MongoDB"}


@router.delete("/doctor-summaries/{summary_id}")
async def delete_doctor_summary(summary_id: str):
    """Delete a doctor summary from MongoDB."""
    if not mongo_manager.is_connected:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="MongoDB is offline")
    result = await mongo_manager.doctor_summaries.delete_one({"id": summary_id})
    return {"success": True, "deleted_count": result.deleted_count}


# -----------------------------------------------------------------------------
# Full Two-Way Sync Endpoint
# -----------------------------------------------------------------------------
@router.post("/sync")
async def sync_data(payload: SyncPayload):
    """Bulk sync local browser storage with MongoDB.
    
    1. Upserts any incoming health, cycle, and summary entries into MongoDB.
    2. Returns the complete consolidated state from MongoDB so client can reconcile.
    """
    if not mongo_manager.is_connected:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="MongoDB is currently unavailable for synchronization",
        )

    upserted_counts = {"health": 0, "cycles": 0, "summaries": 0, "insights": 0}

    # Upsert health entries
    for item in payload.health_entries:
        item_id = item.get("id")
        if item_id:
            await mongo_manager.health_entries.update_one({"id": item_id}, {"$set": item}, upsert=True)
            upserted_counts["health"] += 1

    # Upsert cycle entries
    for item in payload.cycle_entries:
        item_id = item.get("id")
        if item_id:
            await mongo_manager.cycle_entries.update_one({"id": item_id}, {"$set": item}, upsert=True)
            upserted_counts["cycles"] += 1

    # Upsert summaries
    for item in payload.doctor_summaries:
        item_id = item.get("id")
        if item_id:
            await mongo_manager.doctor_summaries.update_one({"id": item_id}, {"$set": item}, upsert=True)
            upserted_counts["summaries"] += 1

    # Upsert insights
    for item in payload.insights:
        item_id = item.get("id")
        if item_id:
            await mongo_manager.insights.update_one({"id": item_id}, {"$set": item}, upsert=True)
            upserted_counts["insights"] += 1

    # Return updated full state from MongoDB
    health_list = await mongo_manager.health_entries.find({}, {"_id": 0}).to_list(length=500)
    cycle_list = await mongo_manager.cycle_entries.find({}, {"_id": 0}).to_list(length=500)
    summary_list = await mongo_manager.doctor_summaries.find({}, {"_id": 0}).to_list(length=200)
    insights_list = await mongo_manager.insights.find({}, {"_id": 0}).to_list(length=200)

    return {
        "success": True,
        "upserted": upserted_counts,
        "remote_data": {
            "health_entries": health_list,
            "cycle_entries": cycle_list,
            "doctor_summaries": summary_list,
            "insights": insights_list,
        },
        "counts": {
            "health_entries": len(health_list),
            "cycle_entries": len(cycle_list),
            "doctor_summaries": len(summary_list),
            "insights": len(insights_list),
        },
    }


# -----------------------------------------------------------------------------
# Data Purge
# -----------------------------------------------------------------------------
@router.delete("/purge")
async def purge_mongo_data():
    """Wipe all user entries stored across MongoDB collections."""
    if not mongo_manager.is_connected:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="MongoDB is offline")
    h = await mongo_manager.health_entries.delete_many({})
    c = await mongo_manager.cycle_entries.delete_many({})
    s = await mongo_manager.doctor_summaries.delete_many({})
    i = await mongo_manager.insights.delete_many({})

    return {
        "success": True,
        "message": "All user data purged from MongoDB",
        "deleted": {
            "health_entries": h.deleted_count,
            "cycle_entries": c.deleted_count,
            "doctor_summaries": s.deleted_count,
            "insights": i.deleted_count,
        },
    }
