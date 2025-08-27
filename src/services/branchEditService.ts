import { supabase } from './supabase';
import { Branch } from '../types';

export async function deleteBranch(id: string): Promise<void> {
  // Soft delete in Supabase
  const { error } = await supabase.from('branches').update({ deleted: true }).eq('id', id);
  if (error) throw error;
}

export async function updateBranch(id: string, updates: Partial<Branch>): Promise<Branch> {
  const { data, error } = await supabase.from('branches').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Branch;
}
