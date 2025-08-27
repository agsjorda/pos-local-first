export interface Branch {
  id: string;
  name: string;
  address: string;
  created_at?: string;
  updated_at?: string;
  deleted?: boolean | number;
}

export interface BranchAssignment {
  branch_id: string;
  user_id: string;
  role: 'manager' | 'user';
  assigned_at?: string;
}
