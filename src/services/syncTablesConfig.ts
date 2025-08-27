
import { Profile } from '../types/profile';
import { Branch, BranchAssignment } from '../types/branch';

export type SyncServiceLike = {
  upsertLocalProfile: (row: Profile) => Promise<any>;
  markProfileSynced: (id: string) => Promise<any>;
  getUnsyncedProfiles: () => Promise<Profile[]>;
  upsertLocalBranch: (row: Branch) => Promise<any>;
  markBranchSynced: (id: string) => Promise<any>;
  getUnsyncedBranches: () => Promise<Branch[]>;
  upsertLocalBranchAssignment: (row: BranchAssignment) => Promise<any>;
  getLocalBranchAssignments: () => Promise<BranchAssignment[]>;
};

export type SyncTableConfig = {
  name: string;
  key: string | string[];
  hasIsSynced: boolean;
  upsertLocal: (row: any, self: SyncServiceLike) => Promise<any>;
  markSynced?: (id: any, self: SyncServiceLike) => Promise<any>;
  getUnsynced?: (self: SyncServiceLike) => Promise<any[]>;
  getLocal?: (self: SyncServiceLike) => Promise<any[]>;
};

export const SYNC_TABLES: SyncTableConfig[] = [
  {
    name: 'profiles',
    key: 'id',
    hasIsSynced: true,
  upsertLocal: (row: Profile, self) => self.upsertLocalProfile(row),
  markSynced: (id: string, self) => self.markProfileSynced(id),
  getUnsynced: (self) => self.getUnsyncedProfiles(),
  },
  {
    name: 'branches',
    key: 'id',
    hasIsSynced: true,
  upsertLocal: (row: Branch, self) => self.upsertLocalBranch(row),
  markSynced: (id: string, self) => self.markBranchSynced(id),
  getUnsynced: (self) => self.getUnsyncedBranches(),
  },
  {
    name: 'branch_assignments',
    key: ['branch_id', 'user_id'],
    hasIsSynced: false,
  upsertLocal: (row: BranchAssignment, self) => self.upsertLocalBranchAssignment(row),
  getLocal: (self) => self.getLocalBranchAssignments(),
  },
  // Add more tables here as needed
];
