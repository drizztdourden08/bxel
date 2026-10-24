/* @layer renderer-app @kind types */
import type { PaletteBank } from '@bxel/document';
import type { ChangePreview, ChangeRequest } from '../../palette-change/palette-change.type';

interface ChangeDialogProps {
  request: ChangeRequest;
}

interface ChangeDialogState {
  bank: PaletteBank | null;
  preview: ChangePreview | null;
  error: string | null;
  failure: string | null;
  apply: () => void;
  cancel: () => void;
}

interface ChangeBodyProps {
  request: ChangeRequest;
  state: ChangeDialogState;
}

export type { ChangeBodyProps, ChangeDialogProps, ChangeDialogState };
