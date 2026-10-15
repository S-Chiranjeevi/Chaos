/**
 * PCOS Saathi - Decoupled Frontend Communication Bus
 * 
 * Standard event bus enabling loose coupling between product areas:
 * - Home
 * - Talk or Type
 * - My Health Tracker
 * - Early Warnings and Insights
 * - Doctor Summary
 * - Learn and Myths
 * - Privacy Controls
 */

import { useEffect, useState } from 'react';

export const EVENTS = {
  HEALTH_ENTRY_CREATED: 'pcos_saathi:health_entry_created',
  CYCLE_ENTRY_LOGGED: 'pcos_saathi:cycle_entry_logged',
  INSIGHTS_UPDATED: 'pcos_saathi:insights_updated',
  RED_FLAG_TRIGGERED: 'pcos_saathi:red_flag_triggered',
  NAVIGATE_REQUEST: 'pcos_saathi:navigate_request',
  LANGUAGE_CHANGED: 'pcos_saathi:language_changed',
  DATA_PURGED: 'pcos_saathi:data_purged',
};

/**
 * Dispatch an application-wide event
 */
export function emitEvent(eventName, payload = {}) {
  if (typeof window === 'undefined') return;
  try {
    const customEvent = new CustomEvent(eventName, {
      detail: { ...payload, timestamp: new Date().toISOString() },
      bubbles: true,
    });
    window.dispatchEvent(customEvent);
  } catch (err) {
    console.warn(`[EventBus] Failed to emit event ${eventName}:`, err);
  }
}

/**
 * React hook to subscribe to an EventBus event
 */
export function useEventSubscription(eventName, callback) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (event) => {
      callback(event.detail);
    };

    window.addEventListener(eventName, handler);
    return () => {
      window.removeEventListener(eventName, handler);
    };
  }, [eventName, callback]);
}

/**
 * React hook to listen for storage data changes
 */
export function useStorageSubscription(storageKey, getterFn) {
  const [data, setData] = useState(() => getterFn());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (event) => {
      if (event.detail?.key === storageKey || event.detail?.key === 'all_purged') {
        setData(getterFn());
      }
    };

    window.addEventListener('pcos_saathi:data_change', handler);
    return () => {
      window.removeEventListener('pcos_saathi:data_change', handler);
    };
  }, [storageKey, getterFn]);

  return data;
}
