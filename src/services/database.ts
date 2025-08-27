import * as SQLite from 'expo-sqlite';
import { Profile } from '../types/profile';

const db = SQLite.openDatabaseSync('pos_local.db');

export const initDatabase = () => {
  db.runSync(`CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT CHECK(role IN ('admin', 'manager', 'user')) DEFAULT 'user',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    synced_at TEXT,
    is_synced INTEGER DEFAULT 0
  );`);
  db.runSync(`CREATE TABLE IF NOT EXISTS branches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );`);
  db.runSync(`CREATE TABLE IF NOT EXISTS branch_assignments (
    branch_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT CHECK(role IN ('manager', 'user')) NOT NULL,
    assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (branch_id, user_id)
  );`);
  return Promise.resolve(true);
};

export const getLocalProfile = (userId: string): Promise<Profile | null> => {
  const rows = db.getAllSync<Profile>('SELECT * FROM profiles WHERE id = ?', [userId]);
  return Promise.resolve(rows[0] || null);
};

export const saveLocalProfile = (profile: Profile): Promise<void> => {
  db.runSync(
    `INSERT OR REPLACE INTO profiles (id, email, name, role, synced_at, is_synced)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 1);`,
    [profile.id ?? null, profile.email ?? null, profile.name ?? null, profile.role ?? null]
  );
  return Promise.resolve();
};

export const getUnsynced = (): Promise<Profile[]> => {
  const rows = db.getAllSync<Profile>('SELECT * FROM profiles WHERE is_synced = 0');
  return Promise.resolve(rows);
};

export const markAsSynced = (userId: string): Promise<void> => {
  db.runSync('UPDATE profiles SET is_synced = 1, synced_at = CURRENT_TIMESTAMP WHERE id = ?', [
    userId,
  ]);
  return Promise.resolve();
};

export const clearLocalProfile = (userId: string): Promise<void> => {
  db.runSync('DELETE FROM profiles WHERE id = ?', [userId]);
  return Promise.resolve();
};
