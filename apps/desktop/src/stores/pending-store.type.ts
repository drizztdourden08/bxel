/* @layer renderer-app @kind types */
import type { PendingEdit, PendingOutcome, PendingSpec } from '../editor/pending/pending.type';

interface PendingSettings {
  pending: PendingEdit | null;
  outcome: PendingOutcome | null;
}

interface PendingState extends PendingSettings {
  begin: (pending: PendingEdit) => void;
  revise: (spec: PendingSpec) => void;
  setEditing: (editing: boolean) => void;
  clear: () => void;
}

export type { PendingSettings, PendingState };
