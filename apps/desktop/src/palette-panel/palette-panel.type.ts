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

interface SheetPlan {
  title: string;
  note: string;
  gone: readonly string[];
  before: readonly string[];
  after: readonly string[];
  steps: readonly CommandStep[];
  label: string;
  done: string;
  apply: string;
}

interface RemovalWords {
  command: string;
  title: string;
  note: (count: number) => string;
  label: string;
  done: (count: number) => string;
  apply: (count: number) => string;
}

type PanelCommand = 'add' | 'ramp' | 'make' | 'make-light' | 'gradient' | 'unused' | 'duplicates' | 'sort';

interface CommandScene {
  target: EditorTarget;
  selection: readonly number[];
  base: number;
}

interface PanelRun {
  target: EditorTarget;
  label: string;
  steps: readonly CommandStep[];
  done: string;
}

export type { CleanUpKind, CommandScene, PanelCommand, PaletteLock, PaletteSharing, PaletteUsage, PanelOutcome, PanelRun, RemovalWords, SheetPlan, SlotUse };
