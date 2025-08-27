// Table schema config for scalable DB init
export type TableSchema = {
  name: string;
  create: string;
  migrations?: { description: string; sql: string }[];
};

export const TABLE_SCHEMAS: TableSchema[] = [
  {
    name: 'profiles',
    create: `CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT,
      role TEXT CHECK(role IN ('admin', 'manager', 'user')) DEFAULT 'user',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      synced_at TEXT,
      is_synced INTEGER DEFAULT 0
    );`,
    migrations: []
  },
  {
    name: 'branches',
    create: `CREATE TABLE IF NOT EXISTS branches (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      synced_at TEXT,
      is_synced INTEGER DEFAULT 0
    );`,
    migrations: [
      {
        description: 'Add address column if missing',
        sql: 'ALTER TABLE branches ADD COLUMN address TEXT',
      },
      {
        description: 'Add synced_at column if missing',
        sql: 'ALTER TABLE branches ADD COLUMN synced_at TEXT',
      },
      {
        description: 'Add is_synced column if missing',
        sql: 'ALTER TABLE branches ADD COLUMN is_synced INTEGER DEFAULT 0',
      },
    ],
  },
  {
    name: 'branch_assignments',
    create: `CREATE TABLE IF NOT EXISTS branch_assignments (
      branch_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT CHECK(role IN ('manager', 'user')) NOT NULL,
      assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (branch_id, user_id)
    );`,
    migrations: []
  },
  // Add more table schemas here as needed
];
