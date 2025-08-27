import { TABLE_SCHEMAS } from '../db/tableSchemas';
import { SYNC_TABLES } from './syncTablesConfig';
import { supabase } from './supabase';
import * as SQLite from 'expo-sqlite';
import { Profile } from '../types/profile';
import NetInfo from '@react-native-community/netinfo';


const SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_BATCH_SIZE = 100;

// ...existing code...

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
      // Scalable table creation
      for (const table of TABLE_SCHEMAS) {
        this.db.runSync(table.create);
        if (table.migrations && table.migrations.length) {
          for (const migration of table.migrations) {
            try {
              this.db.runSync(migration.sql);
            } catch (e) {
              // Ignore error if migration already applied
            }
          }
        }
      }
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
    } catch (error: any) {
      // User-friendly error handling
      let message = 'Sync failed.';
      if (error?.message) {
        message += ' ' + error.message;
      }
      // Optionally, use a toast/snackbar here for UI feedback
      console.error(message, error);
      // Optionally, rethrow or handle error for UI
    } finally {
      this.syncInProgress = false;
    }
  }

  private async pushLocalChanges(): Promise<void> {
    await this.ensureInitialized();
  for (const table of SYNC_TABLES) {
      if (table.hasIsSynced && table.getUnsynced) {
        const unsynced = await table.getUnsynced(this);
        if (unsynced && unsynced.length) {
          for (let i = 0; i < unsynced.length; i += MAX_BATCH_SIZE) {
            const batch = unsynced.slice(i, i + MAX_BATCH_SIZE);
            const { error } = await supabase.from(table.name).upsert(
              batch.map((row: any) => {
                const { is_synced, ...rest } = row;
                return rest;
              }),
              { onConflict: Array.isArray(table.key) ? table.key.join(',') : table.key }
            );
            if (error) throw error;
            if (table.markSynced) {
              await Promise.all(batch.map((row: any) => table.markSynced!(Array.isArray(table.key) ? table.key.map((k: string) => row[k]).join('-') : row[table.key], this)));
            }
          }
        }
      } else if (table.getLocal) {
        const allLocal = await table.getLocal(this);
        if (allLocal && allLocal.length) {
          for (let i = 0; i < allLocal.length; i += MAX_BATCH_SIZE) {
            const batch = allLocal.slice(i, i + MAX_BATCH_SIZE);
            const { error } = await supabase.from(table.name).upsert(batch, { onConflict: Array.isArray(table.key) ? table.key.join(',') : table.key });
            if (error) throw error;
          }
        }
      }
    }
  }

  private async pullRemoteChanges(): Promise<void> {
  for (const table of SYNC_TABLES) {
      let query = supabase.from(table.name).select('*');
      // Only profiles and branches use updated_at for incremental sync
      if (['profiles', 'branches'].includes(table.name)) {
        const since = this.lastSyncTimestamp || '1970-01-01';
        query = query.gt('updated_at', since).order('updated_at', { ascending: true });
      }
      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length) {
        for (let i = 0; i < data.length; i += MAX_BATCH_SIZE) {
          const batch = data.slice(i, i + MAX_BATCH_SIZE);
          await Promise.all(
            batch.map((row: any) =>
              table.upsertLocal(
                {
                  ...row,
                  ...(table.hasIsSynced ? { is_synced: 1, synced_at: new Date().toISOString() } : {}),
                },
                this
              )
            )
          );
        }
      }
    }
  }
  public async getLocalBranchAssignments(): Promise<any[]> {
    await this.ensureInitialized();
    const db = this.getDatabase();
    return db.getAllSync<any>('SELECT * FROM branch_assignments');
  }

  public async upsertLocalBranchAssignment(assignment: any): Promise<void> {
    await this.ensureInitialized();
    const db = this.getDatabase();
    db.runSync(
      `INSERT OR REPLACE INTO branch_assignments (
        branch_id, user_id, role, assigned_at
      ) VALUES (?, ?, ?, ?)`,
      [
        assignment.branch_id ?? null,
        assignment.user_id ?? null,
        assignment.role ?? null,
        assignment.assigned_at ?? null,
      ]
    );
  }
  public async getUnsyncedBranches(): Promise<any[]> {
    await this.ensureInitialized();
    const db = this.getDatabase();
    return db.getAllSync<any>('SELECT * FROM branches WHERE is_synced = 0');
  }

  public async markBranchSynced(id: string): Promise<void> {
    await this.ensureInitialized();
    const db = this.getDatabase();
    db.runSync('UPDATE branches SET is_synced = 1, synced_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  }

  public async upsertLocalBranch(branch: any): Promise<void> {
    await this.ensureInitialized();
    const db = this.getDatabase();
    db.runSync(
      `INSERT OR REPLACE INTO branches (
        id, name, address, created_at, updated_at, synced_at, is_synced
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        branch.id ?? null,
        branch.name ?? null,
        branch.address ?? null,
        branch.created_at ?? null,
        branch.updated_at ?? null,
        branch.synced_at ?? null,
        branch.is_synced ?? null,
      ]
    );
  }

  public async getUnsyncedProfiles(): Promise<Profile[]> {
    await this.ensureInitialized();
    const db = this.getDatabase();
    return db.getAllSync<Profile>('SELECT * FROM profiles WHERE is_synced = 0');
  }

  public async markProfileSynced(id: string): Promise<void> {
    await this.ensureInitialized();
    const db = this.getDatabase();
    db.runSync('UPDATE profiles SET is_synced = 1, synced_at = CURRENT_TIMESTAMP WHERE id = ?', [
      id,
    ]);
  }

  public async upsertLocalProfile(profile: Profile): Promise<void> {
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
