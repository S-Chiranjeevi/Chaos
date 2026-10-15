import React, { useState, useEffect } from 'react';
import {
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  CloudUpload,
  Server,
  Zap,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { mongoService } from '../services/mongoService.js';
import { StorageService } from '../services/storageService.js';

export function MongoStatusCard({ className = '' }) {
  const [status, setStatus] = useState({
    connected: false,
    db_name: 'sakhicare_db',
    uri: 'mongodb://localhost:27017',
    latency_ms: null,
    error: null,
    collections: {
      health_entries: 0,
      cycle_entries: 0,
      doctor_summaries: 0,
      insights: 0,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [uriInput, setUriInput] = useState('mongodb://localhost:27017');
  const [dbNameInput, setDbNameInput] = useState('sakhicare_db');
  const [configFeedback, setConfigFeedback] = useState(null);

  // Poll status on mount
  useEffect(() => {
    checkStatus();
  }, []);

  async function checkStatus() {
    setIsLoading(true);
    try {
      const res = await mongoService.getStatus(true);
      setStatus(res);
      if (res.uri) setUriInput(res.uri);
      if (res.db_name) setDbNameInput(res.db_name);
    } catch (err) {
      console.warn('MongoDB status check failed', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSyncNow() {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await StorageService.syncWithMongoDB();
      if (res.success) {
        setSyncFeedback({
          type: 'success',
          message: `Synced successfully! (${res.data?.upserted?.health || 0} symptoms, ${res.data?.upserted?.cycles || 0} cycles uploaded to MongoDB).`,
        });
        await checkStatus();
      } else {
        setSyncFeedback({
          type: 'error',
          message: res.error || 'Sync could not reach MongoDB server. Local data preserved.',
        });
      }
    } catch (err) {
      setSyncFeedback({
        type: 'error',
        message: err.message || 'Sync failed. Local data remains intact.',
      });
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleSaveConfig(e) {
    e.preventDefault();
    setIsLoading(true);
    setConfigFeedback(null);
    try {
      const res = await mongoService.configureConnection({
        uri: uriInput.trim(),
        dbName: dbNameInput.trim(),
      });
      if (res.success) {
        setConfigFeedback({
          type: 'success',
          message: res.message || 'Connected to MongoDB!',
        });
        await checkStatus();
      } else {
        setConfigFeedback({
          type: 'error',
          message: res.message || 'Connection failed. Verify connection string or ensure MongoDB is running.',
        });
      }
    } catch (err) {
      setConfigFeedback({
        type: 'error',
        message: err.message || 'Could not configure database.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`bg-white/95 rounded-3xl border border-stone-200/90 p-5 md:p-6 shadow-sm backdrop-blur-xl relative overflow-hidden transition-all ${className}`}>
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors shadow-xs ${
            status.connected
              ? 'bg-emerald-100/80 text-emerald-700'
              : 'bg-amber-100/80 text-amber-700'
          }`}>
            <Database size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 text-sm md:text-base">
                MongoDB Database Vault
              </h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                status.connected
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.connected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-600'}`} />
                {status.connected ? 'Connected' : 'Offline / Local'}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Hybrid Storage: Local device cache + Private MongoDB collections
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={checkStatus}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh database connectivity"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span>Check</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={13} />
            <span>Configure URI</span>
            {showConfig ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* Sync Status Feedback Toast */}
      {syncFeedback && (
        <div className={`p-3 rounded-2xl mb-4 text-xs flex items-start gap-2.5 transition-all ${
          syncFeedback.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {syncFeedback.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
          )}
          <span className="font-medium leading-relaxed">{syncFeedback.message}</span>
        </div>
      )}

      {/* MongoDB Live Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/70 text-center">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Symptoms</span>
          <span className="text-lg font-extrabold text-stone-900 mt-0.5 block">
            {status.collections?.health_entries || 0}
          </span>
          <span className="text-[10px] text-stone-400">in MongoDB</span>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/70 text-center">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Cycles</span>
          <span className="text-lg font-extrabold text-stone-900 mt-0.5 block">
            {status.collections?.cycle_entries || 0}
          </span>
          <span className="text-[10px] text-stone-400">in MongoDB</span>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/70 text-center">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Summaries</span>
          <span className="text-lg font-extrabold text-stone-900 mt-0.5 block">
            {status.collections?.doctor_summaries || 0}
          </span>
          <span className="text-[10px] text-stone-400">in MongoDB</span>
        </div>

        <div className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/70 text-center">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">Latency</span>
          <span className="text-lg font-extrabold text-rose-700 mt-0.5 block">
            {status.latency_ms ? `${status.latency_ms} ms` : '—'}
          </span>
          <span className="text-[10px] text-stone-400">{status.db_name}</span>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-stone-100">
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <ShieldCheck size={16} className="text-rose-600 shrink-0" />
          <span>
            {status.connected
              ? `Live database sync enabled on [${status.db_name}]`
              : 'Local fallback active. Launch MongoDB service or set Atlas URI to sync.'}
          </span>
        </div>

        <button
          type="button"
          onClick={handleSyncNow}
          disabled={isSyncing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow-sm hover:shadow-md"
        >
          <CloudUpload size={15} className={isSyncing ? 'animate-bounce' : ''} />
          <span>{isSyncing ? 'Syncing to MongoDB…' : 'Sync Local Data to MongoDB'}</span>
        </button>
      </div>

      {/* Expandable Configuration Drawer */}
      {showConfig && (
        <form onSubmit={handleSaveConfig} className="mt-4 pt-4 border-t border-stone-200 space-y-3 bg-stone-50/60 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Server size={14} className="text-rose-600" />
              <span>MongoDB Connection Details</span>
            </h4>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setUriInput('mongodb://localhost:27017')}
                className="text-[11px] px-2 py-0.5 rounded bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 cursor-pointer"
              >
                Localhost Preset
              </button>
              <button
                type="button"
                onClick={() => setUriInput('mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority')}
                className="text-[11px] px-2 py-0.5 rounded bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 cursor-pointer"
              >
                Atlas Template
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">
              MongoDB URI (Connection String)
            </label>
            <input
              type="text"
              value={uriInput}
              onChange={(e) => setUriInput(e.target.value)}
              placeholder="mongodb://localhost:27017 or mongodb+srv://..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none bg-white font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                Database Name
              </label>
              <input
                type="text"
                value={dbNameInput}
                onChange={(e) => setDbNameInput(e.target.value)}
                placeholder="sakhicare_db"
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none bg-white"
                required
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                <Zap size={14} className={isLoading ? 'animate-spin' : ''} />
                <span>{isLoading ? 'Testing connection…' : 'Test & Connect'}</span>
              </button>
            </div>
          </div>

          {configFeedback && (
            <div className={`p-2.5 rounded-xl text-xs font-medium ${
              configFeedback.type === 'success'
                ? 'bg-emerald-100/70 text-emerald-800'
                : 'bg-rose-100/70 text-rose-800'
            }`}>
              {configFeedback.message}
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default MongoStatusCard;
