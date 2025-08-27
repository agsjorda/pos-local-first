import { supabase } from './supabase';
import { Profile } from '../types/profile';

// Get all users (optionally filter by role)
export async function getAllProfiles(role?: 'admin' | 'manager' | 'user'): Promise<Profile[]> {
  let query = supabase.from('profiles').select('*');
  if (role) {
    query = query.eq('role', role);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as Profile[];
}
