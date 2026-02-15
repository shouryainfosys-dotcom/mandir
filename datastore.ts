import { createClient } from '@supabase/supabase-js';
import { AppState } from './types';
import { INITIAL_DATA } from './constants';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';

const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

export const getData = async (): Promise<AppState> => {
  if (!supabase) return INITIAL_DATA;
  try {
    const { data, error } = await supabase
      .from('temple_configs')
      .select('config_json')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) return INITIAL_DATA;
    return data.config_json as AppState;
  } catch (e) {
    console.warn("Supabase Fetch Error:", e);
    return INITIAL_DATA;
  }
};

export const saveData = async (data: AppState) => {
  if (!supabase) return;
  try {
    await supabase
      .from('temple_configs')
      .upsert({ id: 1, config_json: data });
  } catch (e) {
    console.warn("Supabase Save Error:", e);
  }
};

export const checkAdminAuth = (user: string, pass: string): boolean => {
  return user === 'admin' && pass === 'vitthal123';
};