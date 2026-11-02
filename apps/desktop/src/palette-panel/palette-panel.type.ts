/* @layer renderer-app @kind types */
import type { Animation, CommandStep, Sprite } from '@bxel/document';
import type { PaletteTarget } from '../editor/editor.type';
import type { UsageScope } from '../palette-view/palette-view.type';

interface SlotUse {
  pixels: number;
  frames: number;
}

interface PaletteUsage {
  slots: readonly SlotUse[];
  unused: readonly number[];
  duplicates: readonly (readonly number[])[];
}

interface AlphaLimit {
  binary: boolean;
  reason: string;
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

type ReplaceScope = 'frame' | 'sprite' | 'animation' | 'selection';

interface UsageReach {
  sprite: Sprite | null;
  scope: UsageScope;
  animation?: Animation;
}

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
  target: PaletteTarget;
  selection: readonly number[];
  base: number;
}

interface PanelRun {
  target: PaletteTarget;
  label: string;
  steps: readonly CommandStep[];
  done: string;
}

export type { AlphaLimit, CleanUpKind, CommandScene, PanelCommand, PaletteLock, PaletteSharing, PaletteUsage, PanelOutcome, PanelRun, RemovalWords, ReplaceScope, SheetPlan, SlotUse, UsageReach };
