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
