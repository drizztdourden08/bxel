/* @layer renderer-app @kind hook */
import { toast, useRecoverable } from '@drizztdourden08/brock-react';
import { useCallback, useState } from 'react';
import { liveRestoreKit } from '../../../recovery/live-restore-kit';
import { recoverSnapshot } from '../../../recovery/recover-snapshot';
import type { RecoveryPromptState } from './recovery-prompt.type';

const useRecoveryPrompt = (): RecoveryPromptState => {
  const { snapshots, restore, discard } = useRecoverable();
  const [deferred, setDeferred] = useState<readonly string[]>([]);
  const pending = snapshots.filter((snapshot) => !deferred.includes(snapshot.key));
  const current = pending[0] ?? null;

  const later = useCallback((): void => {
    if (current) setDeferred((keys) => [...keys, current.key]);
  }, [current]);

  const doRestore = useCallback((): void => {
    if (!current) return;
    void recoverSnapshot(current.key, { restore, discard, kit: liveRestoreKit() }).then((failure) => {
      if (failure === null) return;
      toast(failure, { variant: 'danger' });
      later();
    });
  }, [current, restore, discard, later]);

  const doDiscard = useCallback((): void => {
    if (current) void discard(current.key);
  }, [current, discard]);

  return { current, waiting: pending.length - 1, restore: doRestore, discard: doDiscard, later };
};

export { useRecoveryPrompt };
