
import { createClient } from '@supabase/supabase-js';
import { AppState } from './types';
import { INITIAL_DATA } from './constants';

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
const STORAGE_KEY = 'temple_app_data_v1';

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

export const getData = async (): Promise<AppState> => {
  const localData = localStorage.getItem(STORAGE_KEY);
  let state: AppState | null = null;

  if (localData) {
    try {
      state = JSON.parse(localData);
    } catch (e) {
      console.error("Local Storage Parse Error:", e);
    }
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('temple_configs')
        .select('config_json')
        .eq('id', 1)
        .maybeSingle();

      if (!error && data?.config_json) {
        const remoteState = data.config_json as AppState;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteState));
        return remoteState;
      }
    } catch (e) {
      console.warn("Supabase Fetch Error, using local backup:", e);
    }
  }

  return state || INITIAL_DATA;
};

export const saveData = async (data: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  if (supabase) {
    try {
      const { error } = await supabase
        .from('temple_configs')
        .upsert({ id: 1, config_json: data });
      
      if (error) throw error;
    } catch (e) {
      console.error("Supabase Save Error:", e);
      throw e;
    }
  }
};

export const checkAdminAuth = (user: string, pass: string): boolean => {
  return user === 'admin' && pass === 'vitthal123';
};
