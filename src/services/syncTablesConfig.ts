
export type SyncTableConfig = {
  name: string;
  key: string | string[];
  hasIsSynced: boolean;
  upsertLocal: (row: any, self: any) => Promise<any>;
  markSynced?: (id: any, self: any) => Promise<any>;
  getUnsynced?: (self: any) => Promise<any[]>;
  getLocal?: (self: any) => Promise<any[]>;
};

export const SYNC_TABLES: SyncTableConfig[] = [
  {
    name: 'profiles',
    key: 'id',
    hasIsSynced: true,
    upsertLocal: (row, self) => self.upsertLocalProfile(row),
    markSynced: (id, self) => self.markProfileSynced(id),
    getUnsynced: (self) => self.getUnsyncedProfiles(),
  },
  {
    name: 'branches',
    key: 'id',
    hasIsSynced: true,
    upsertLocal: (row, self) => self.upsertLocalBranch(row),
    markSynced: (id, self) => self.markBranchSynced(id),
    getUnsynced: (self) => self.getUnsyncedBranches(),
  },
  {
    name: 'branch_assignments',
    key: ['branch_id', 'user_id'],
    hasIsSynced: false,
    upsertLocal: (row, self) => self.upsertLocalBranchAssignment(row),
    getLocal: (self) => self.getLocalBranchAssignments(),
  },
  // Add more tables here as needed
];
