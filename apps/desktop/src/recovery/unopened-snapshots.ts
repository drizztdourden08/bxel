/* @layer renderer-app @kind logic */
import type { RecoverableSnapshot } from '@drizztdourden08/brock-core';

const unopenedSnapshots = (snapshots: readonly RecoverableSnapshot[], openKeys: readonly string[]): RecoverableSnapshot[] =>
  snapshots.filter((snapshot) => !openKeys.includes(snapshot.key));

export { unopenedSnapshots };
