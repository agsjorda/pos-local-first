import { supabase } from './supabase';
import * as SQLite from 'expo-sqlite';
import { Profile } from '../types/profile';
import NetInfo from '@react-native-community/netinfo';

const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_BATCH_SIZE = 100;

class SyncService {
  private db: SQLite.SQLiteDatabase | null = null;
  private syncInProgress: boolean = false;
  private lastSyncTimestamp: string | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private initialized: boolean = false;

  constructor() {}

  private async init() {
    if (this.initialized) return;
    try {
      const db = SQLite.openDatabaseSync('pos_local.db');
      if (!db) throw new Error('Failed to open database');
      this.db = db;
      if (!this.db) throw new Error('Database not initialized');
      // Profiles table
      this.db.runSync(`CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        name TEXT,
        role TEXT CHECK(role IN ('admin', 'manager', 'user')) DEFAULT 'user',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        synced_at TEXT,
        is_synced INTEGER DEFAULT 0
      );`);
      // Branches table (with address)
      this.db.runSync(`CREATE TABLE IF NOT EXISTS branches (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`);
      // Migration: add address column if missing
      try {
        this.db.runSync('ALTER TABLE branches ADD COLUMN address TEXT');
      } catch (e) {
        // Ignore error if column already exists
      }
      // Branch assignments table
      this.db.runSync(`CREATE TABLE IF NOT EXISTS branch_assignments (
        branch_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        role TEXT CHECK(role IN ('manager', 'user')) NOT NULL,
        assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (branch_id, user_id)
      );`);
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  public async ensureInitialized() {
    if (!this.initialized) {
      await this.init();
    }
  }

  public getDatabase(): SQLite.SQLiteDatabase {
    if (!this.initialized || !this.db) {
      throw new Error('Database not initialized. Call ensureInitialized() first.');
    }
    return this.db;
  }

  public async getProfile(userId: string): Promise<Profile | null> {
    await this.ensureInitialized();
    const db = this.getDatabase();
    const rows = db.getAllSync<Profile>('SELECT * FROM profiles WHERE id = ? LIMIT 1', [userId]);
    return rows[0] || null;
  }

  public async startSync(): Promise<void> {
    await this.ensureInitialized();
    await this.syncData();
    this.syncInterval = setInterval(async () => {
      await this.syncData();
    }, SYNC_INTERVAL);
  }

  public stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  public async syncData(): Promise<void> {
    if (this.syncInProgress) return;
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) return;
    try {
      this.syncInProgress = true;
      await this.pushLocalChanges();
      await this.pullRemoteChanges();
      this.lastSyncTimestamp = new Date().toISOString();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async pushLocalChanges(): Promise<void> {
    await this.ensureInitialized();
    const unsynced = await this.getUnsyncedProfiles();
    if (!unsynced.length) return;
    for (let i = 0; i < unsynced.length; i += MAX_BATCH_SIZE) {
      const batch = unsynced.slice(i, i + MAX_BATCH_SIZE);
      const { error } = await supabase.from('profiles').upsert(
        batch.map(({ is_synced, ...profile }) => profile),
        { onConflict: 'id' }
      );
      if (error) throw error;
      await Promise.all(batch.map((profile) => this.markProfileSynced(profile.id)));
    }
  }

  private async pullRemoteChanges(): Promise<void> {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .gt('updated_at', this.lastSyncTimestamp || '1970-01-01')
      .order('updated_at', { ascending: true });
    if (error) throw error;
    if (!profiles?.length) return;
    for (let i = 0; i < profiles.length; i += MAX_BATCH_SIZE) {
      const batch = profiles.slice(i, i + MAX_BATCH_SIZE);
      await Promise.all(
        batch.map((profile) =>
          this.upsertLocalProfile({
            ...profile,
            is_synced: 1,
            synced_at: new Date().toISOString(),
          })
        )
      );
    }
  }

  private async getUnsyncedProfiles(): Promise<Profile[]> {
    await this.ensureInitialized();
    const db = this.getDatabase();
    return db.getAllSync<Profile>('SELECT * FROM profiles WHERE is_synced = 0');
  }

  private async markProfileSynced(id: string): Promise<void> {
    await this.ensureInitialized();
    const db = this.getDatabase();
    db.runSync('UPDATE profiles SET is_synced = 1, synced_at = CURRENT_TIMESTAMP WHERE id = ?', [
      id,
    ]);
  }

  private async upsertLocalProfile(profile: Profile): Promise<void> {
    await this.ensureInitialized();
    const db = this.getDatabase();
    db.runSync(
      `INSERT OR REPLACE INTO profiles (
				id, email, name, role, created_at, updated_at, synced_at, is_synced
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.id ?? null,
        profile.email ?? null,
        profile.name ?? null,
        profile.role ?? null,
        profile.created_at ?? null,
        profile.updated_at ?? null,
        profile.synced_at ?? null,
        profile.is_synced ?? null,
      ]
    );
  }
}

export const syncService = new SyncService();
