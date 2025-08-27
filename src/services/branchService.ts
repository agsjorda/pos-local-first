import { supabase } from './supabase';
import { Branch, BranchAssignment } from '../types';
import uuid from 'react-native-uuid';
import { saveLocalBranch } from './localBranch';

export async function createBranch({ name, address }: { name: string; address: string }): Promise<Branch> {
  const id = uuid.v4() as string;
  // Insert into Supabase
  const { data, error } = await supabase.from('branches').insert([{ id, name, address }]).select().single();
  if (error) throw error;
  // Insert into local SQLite
  await saveLocalBranch(data as Branch);
  return data as Branch;
}

export async function assignUserToBranch(branch_id: string, user_id: string, role: 'manager' | 'user'): Promise<BranchAssignment> {
  const { data, error } = await supabase.from('branch_assignments').upsert([
    { branch_id, user_id, role }
  ]).select().single();
  if (error) throw error;
  return data as BranchAssignment;
}

export async function getBranches(): Promise<Branch[]> {
  const { data, error } = await supabase.from('branches').select('*');
  if (error) throw error;
  return data as Branch[];
}

export async function getBranchAssignments(branch_id: string): Promise<BranchAssignment[]> {
  const { data, error } = await supabase.from('branch_assignments').select('*').eq('branch_id', branch_id);
  if (error) throw error;
  return data as BranchAssignment[];
}
