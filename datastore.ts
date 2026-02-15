
import { createClient } from '@supabase/supabase-js';
import { AppState } from './types';
import { INITIAL_DATA } from './constants';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';
const STORAGE_KEY = 'temple_app_data';

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

export const getData = async (): Promise<AppState> => {
  // Try to get from Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('temple_configs')
        .select('config_json')
        .eq('id', 1)
        .maybeSingle();

      if (!error && data?.config_json) {
        return data.config_json as AppState;
      }
    } catch (e) {
      console.warn("Supabase Fetch Error:", e);
    }
  }

  // Fallback to localStorage
  const localData = localStorage.getItem(STORAGE_KEY);
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {
      console.error("Local Storage Parse Error:", e);
    }
  }

  return INITIAL_DATA;
};

export const saveData = async (data: AppState) => {
  // Always save to localStorage for immediate persistence
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // Save to Supabase if available
  if (supabase) {
    try {
      await supabase
        .from('temple_configs')
        .upsert({ id: 1, config_json: data });
    } catch (e) {
      console.warn("Supabase Save Error:", e);
    }
  }
};

export const checkAdminAuth = (user: string, pass: string): boolean => {
  return user === 'admin' && pass === 'vitthal123';
};
