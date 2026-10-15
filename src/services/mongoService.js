/**
 * PCOS Saathi & SakhiCare - MongoDB Service
 * 
 * Provides client-side connectivity, synchronization, and health checks
 * communicating with the FastAPI MongoDB backend endpoints (/api/db).
 */

const BACKEND_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL) 
  ? import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '') 
  : 'http://localhost:8000';

class MongoService {
  constructor() {
    this.baseUrl = BACKEND_BASE;
    this.cachedStatus = {
      connected: false,
      db_name: 'sakhicare_db',
      uri: 'mongodb://localhost:27017',
      latency_ms: null,
      error: 'Not checked yet',
      collections: {
        health_entries: 0,
        cycle_entries: 0,
        doctor_summaries: 0,
        insights: 0,
      },
    };
    this.lastChecked = 0;
  }

  /**
   * Check connection status, ping latency, and collection document counts.
   */
  async getStatus(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && (now - this.lastChecked < 4000)) {
      return this.cachedStatus;
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/db/status`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) {
        this.cachedStatus = {
          ...this.cachedStatus,
          connected: false,
          error: `Server returned HTTP ${res.status}`,
        };
        return this.cachedStatus;
      }

      const data = await res.json();
      this.cachedStatus = data;
      this.lastChecked = now;
      return data;
    } catch (err) {
      this.cachedStatus = {
        ...this.cachedStatus,
        connected: false,
        error: err.message || 'Cannot reach backend server at http://localhost:8000',
      };
      this.lastChecked = now;
      return this.cachedStatus;
    }
  }

  /**
   * Dynamically test and update MongoDB connection URI (e.g. MongoDB Atlas or custom port).
   */
  async configureConnection({ uri, dbName = 'sakhicare_db', timeoutMs = 4000 }) {
    try {
      const res = await fetch(`${this.baseUrl}/api/db/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uri,
          db_name: dbName,
          timeout_ms: timeoutMs,
        }),
      });

      const data = await res.json();
      if (data.status) {
        this.cachedStatus = data.status;
        this.lastChecked = Date.now();
      }
      return data;
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Failed to send configuration to backend',
      };
    }
  }

  /**
   * Synchronize all local storage records (health entries, cycles, summaries) to MongoDB.
   */
  async syncAll(localPayload) {
    try {
      const res = await fetch(`${this.baseUrl}/api/db/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          health_entries: localPayload.health_entries || [],
          cycle_entries: localPayload.cycle_entries || [],
          doctor_summaries: localPayload.doctor_summaries || [],
          insights: localPayload.insights || [],
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Sync failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      // Refresh status counts
      await this.getStatus(true);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Save a single health entry directly to MongoDB.
   */
  async saveHealthEntry(entry) {
    try {
      const res = await fetch(`${this.baseUrl}/api/db/health-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      return await res.json();
    } catch (err) {
      console.warn('MongoDB background save deferred (offline mode active):', err.message);
      return null;
    }
  }

  /**
   * Save a cycle entry directly to MongoDB.
   */
  async saveCycleEntry(cycleEntry) {
    try {
      const res = await fetch(`${this.baseUrl}/api/db/cycle-entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cycleEntry),
      });
      return await res.json();
    } catch (err) {
      console.warn('MongoDB cycle save deferred:', err.message);
      return null;
    }
  }

  /**
   * Save a doctor summary directly to MongoDB.
   */
  async saveDoctorSummary(summary) {
    try {
      const res = await fetch(`${this.baseUrl}/api/db/doctor-summaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary),
      });
      return await res.json();
    } catch (err) {
      console.warn('MongoDB summary save deferred:', err.message);
      return null;
    }
  }

  /**
   * Purge all records from MongoDB.
   */
  async purgeAll() {
    try {
      const res = await fetch(`${this.baseUrl}/api/db/purge`, {
        method: 'DELETE',
      });
      const data = await res.json();
      await this.getStatus(true);
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const mongoService = new MongoService();
export default mongoService;
