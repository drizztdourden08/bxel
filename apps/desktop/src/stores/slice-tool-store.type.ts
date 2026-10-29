/* @layer renderer-app @kind types */
import type { SliceId } from '@bxel/document';

interface SliceToolState {
  selected: SliceId | null;
  dialog: SliceId | null;
  select: (selected: SliceId | null) => void;
  openDialog: (dialog: SliceId) => void;
  closeDialog: () => void;
}

export type { SliceToolState };
