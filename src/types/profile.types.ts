export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
  created_at?: string;
  updated_at?: string;
  synced_at?: string;
  is_synced?: number;
}
