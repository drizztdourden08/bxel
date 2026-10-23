/* @layer renderer-app @kind logic */
import { reasonOf } from '../files/reason-of';
import { RECOVERY_TEXT } from './recovery.constants';
import type { RecoverOps } from './recovery.type';
import { restoreRecovered } from './restore-recovered';

const recoverSnapshot = async (key: string, ops: RecoverOps): Promise<string | null> => {
  try {
    const recovered = await ops.restore(key);
    if (recovered === null) return RECOVERY_TEXT.missing;
    await restoreRecovered(ops.kit, { path: recovered.snapshot.path, bytes: recovered.bytes });
    await ops.discard(key);
    return null;
  } catch (error) {
    return RECOVERY_TEXT.restoreFailed(reasonOf(error));
  }
};

export { recoverSnapshot };
