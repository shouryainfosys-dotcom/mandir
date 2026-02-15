
import { AppState } from '../types';
import { INITIAL_DATA } from '../constants';

const STORAGE_KEY = 'temple_app_data';

export const getData = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : INITIAL_DATA;
};

export const saveData = (data: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const checkAdminAuth = (user: string, pass: string): boolean => {
  // Production reminder: Use real backend authentication and password hashing.
  return user === 'admin' && pass === 'vitthal123';
};
