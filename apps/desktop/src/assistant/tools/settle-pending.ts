/* @layer renderer-app @kind logic */
import { commitPending } from '../../editor/pending/commit-pending';
import type { PendingEdit } from '../../editor/pending/pending.type';
import { usePendingStore } from '../../stores/usePendingStore';
import { APP_TOOL_TEXT } from './app-tool.constants';

const settlePending = (before: PendingEdit | null): string | null => {
  const { pending } = usePendingStore.getState();
  if (pending === null || pending === before || pending.editing) return null;
  return commitPending() ? null : APP_TOOL_TEXT.pendingFailed;
};

export { settlePending };
