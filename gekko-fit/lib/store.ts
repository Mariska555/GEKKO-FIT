import type { SetRecord } from './types';

const LOG_KEY = 'gekko-fit-logs-v1';
const BW_KEY = 'gekko-fit-bodyweight';

export const UPDATE_EVENT = 'gekko-fit-update';

export function loadLogs(): SetRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOG_KEY) || '[]') as SetRecord[];
  } catch {
    return [];
  }
}

export function saveLogs(logs: SetRecord[]): void {
  window.localStorage.setItem(LOG_KEY, JSON.stringify(logs));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function loadBodyweight(): number {
  if (typeof window === 'undefined') return 75;
  const v = Number(window.localStorage.getItem(BW_KEY));
  return v > 0 ? v : 75;
}

export function saveBodyweight(w: number): void {
  window.localStorage.setItem(BW_KEY, String(w));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function newId(): string {
  if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}