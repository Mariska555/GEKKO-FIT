'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SetRecord } from './types';
import { calcXP } from './xp';
import { loadLogs, newId, saveLogs, UPDATE_EVENT } from './store';

export interface AddSetInput {
  exerciseId: string;
  weight: number;
  reps: number;
}

export function useLogs() {
  const [logs, setLogs] = useState<SetRecord[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setLogs(loadLogs());
    sync();
    setReady(true);
    window.addEventListener(UPDATE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(UPDATE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const addSet = useCallback((input: AddSetInput, streakWeeks: number): SetRecord => {
    const rec: SetRecord = {
      id: newId(),
      exerciseId: input.exerciseId,
      weight: input.weight,
      reps: input.reps,
      xp: calcXP(input.weight, input.reps, streakWeeks),
      date: new Date().toISOString(),
    };
    saveLogs([...loadLogs(), rec]);
    return rec;
  }, []);

  const removeSet = useCallback((id: string) => {
    saveLogs(loadLogs().filter((l) => l.id !== id));
  }, []);

  const clearExercise = useCallback((exerciseId: string) => {
    saveLogs(loadLogs().filter((l) => l.exerciseId !== exerciseId));
  }, []);

  return { logs, ready, addSet, removeSet, clearExercise };
}

export function useBodyweight(): [number, (w: number) => void] {
  const [bw, setBw] = useState(75);
  useEffect(() => {
    const sync = () => setBw(loadBwSafe());
    sync();
    window.addEventListener(UPDATE_EVENT, sync);
    return () => window.removeEventListener(UPDATE_EVENT, sync);
  }, []);
  const set = useCallback((w: number) => {
    setBw(w);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('gekko-fit-bodyweight', String(w));
      window.dispatchEvent(new Event(UPDATE_EVENT));
    }
  }, []);
  return [bw, set];
}

function loadBwSafe(): number {
  if (typeof window === 'undefined') return 75;
  const v = Number(window.localStorage.getItem('gekko-fit-bodyweight'));
  return v > 0 ? v : 75;
}