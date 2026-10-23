/* @layer renderer-app @kind logic */
import { getPlatform } from '@drizztdourden08/brock-react';
import type { SnapshotSink } from './recovery.type';

const platformSink: SnapshotSink = {
  snapshot: async (key, data, meta) => {
    await getPlatform().documents?.snapshot(key, data, meta);
  },
  discard: async (key) => {
    await getPlatform().documents?.discardSnapshot(key);
  },
};

export { platformSink };
