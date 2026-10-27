/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../../stores/useDocumentStore';
import { buildPending } from './begin-pending';
import type { PendingSpec } from './pending.type';
import { pendingRequest } from './pending-request';

const NO_SPRITE = 'No sprite is open to change.';

const commitSpec = (spec: PendingSpec): string | null => {
  const built = buildPending(spec, false);
  if (!built) return NO_SPRITE;
  if (built.blocked !== null) return built.blocked;
  const result = useDocumentStore.getState().host.execute(pendingRequest(built.target, built.pending, 'commit'));
  return result.ok ? null : result.error.message;
};

export { commitSpec };
