import * as SQLite from 'expo-sqlite';
import { Branch } from '../types/branch';

const db = SQLite.openDatabaseSync('pos_local.db');

export const saveLocalBranch = (branch: Branch): Promise<void> => {
  db.runSync(
    `INSERT OR REPLACE INTO branches (id, name, address, created_at, updated_at) VALUES (?, ?, ?, ?, ?);`,
    [
      branch.id,
      branch.name,
      branch.address,
      branch.created_at ?? null,
      branch.updated_at ?? null,
    ]
  );
  return Promise.resolve();
};

export const deleteLocalBranch = (id: string): Promise<void> => {
  db.runSync('UPDATE branches SET deleted = 1 WHERE id = ?', [id]);
  return Promise.resolve();
};

export const updateLocalBranch = (id: string, updates: Partial<Branch>): Promise<void> => {
  const fields = [];
  const values = [];
  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.address !== undefined) {
    fields.push('address = ?');
    values.push(updates.address);
  }
  if (updates.updated_at !== undefined) {
    fields.push('updated_at = ?');
    values.push(updates.updated_at);
  }
  if (fields.length === 0) return Promise.resolve();
  values.push(id);
  db.runSync(`UPDATE branches SET ${fields.join(', ')} WHERE id = ?`, values);
  return Promise.resolve();
};
