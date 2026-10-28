/* @layer renderer-app @kind types */
import type { CommandStep, Sprite } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';

interface SlotUse {
  pixels: number;
  frames: number;
}

interface PaletteUsage {
  slots: readonly SlotUse[];
  unused: readonly number[];
  duplicates: readonly (readonly number[])[];
}

interface PaletteLock {
  locked: boolean;
  reason: string;
}

interface PaletteSharing {
  sprites: readonly Sprite[];
  shared: boolean;
}

type CleanUpKind = 'unused' | 'duplicates';

type PanelOutcome = { ok: true; message: string } | { ok: false; message: string };

interface SwatchCommit {
  index: number;
  rgb: string;
  alpha: number;
  name: string;
}

interface PanelRun {
  target: EditorTarget;
  label: string;
  steps: readonly CommandStep[];
  done: string;
}

export type { CleanUpKind, PaletteLock, PaletteSharing, PaletteUsage, PanelOutcome, PanelRun, SlotUse, SwatchCommit };
