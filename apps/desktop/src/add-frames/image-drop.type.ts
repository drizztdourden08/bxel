/* @layer renderer-app @kind types */
import type { PaletteBank } from '@bxel/document';
import type { SourceImage } from '../image-import/image-import.type';
import type { AnimationFocus } from '../timeline/timeline.type';

interface DropSize {
  width: number;
  height: number;
}

type DropPlan = { kind: 'frame' } | { kind: 'strip'; cells: number } | { kind: 'refuse'; reason: string };

type FitResult = { ok: true; pixels: Uint8Array } | { ok: false; reason: string };

interface StripFile {
  name: string;
  width: number;
  height: number;
  rgba: Uint8ClampedArray;
  bankId: string;
  at: number;
}

type DropRead = { ok: true; image: SourceImage } | { ok: false; reason: string };

interface DropTarget {
  focus: AnimationFocus;
  bank: PaletteBank | undefined;
  at: number;
}

type DropOutcome = { kind: 'frame'; pixels: Uint8Array } | { kind: 'strip'; strip: StripFile } | { kind: 'refuse'; reason: string };

export type { DropOutcome, DropPlan, DropRead, DropSize, DropTarget, FitResult, StripFile };
