/* @layer renderer-app @kind types */
import type { DocumentId, FlipAxis, SpriteId, TurnDirection } from '@bxel/document';
import type { BoundsPolicy, MaskView, Point } from '@bxel/raster';
import type { Clip } from '../selection/selection.type';

type PendingSpec =
  | { kind: 'flip'; axis: FlipAxis }
  | { kind: 'turn'; direction: TurnDirection }
  | { kind: 'rotate'; angle: number; bounds: BoundsPolicy }
  | { kind: 'scale'; width: number; height: number; bounds: BoundsPolicy }
  | { kind: 'move'; offset: Point }
  | { kind: 'paste'; clip: Clip; offset: Point };

type DialogSpec = Extract<PendingSpec, { kind: 'rotate' | 'scale' }>;

interface PendingEdit {
  documentId: DocumentId;
  sprites: readonly SpriteId[];
  spec: PendingSpec;
  mask: MaskView | null;
  editing: boolean;
}

interface PreviewFrame {
  width: number;
  height: number;
  rgba: Uint8ClampedArray<ArrayBuffer>;
  indices: Uint8Array;
}

interface OtherFrame {
  spriteId: SpriteId;
  frame: PreviewFrame;
}

interface PendingOutcome {
  width: number;
  height: number;
  frame: PreviewFrame | null;
  others: readonly OtherFrame[];
  clipping: string;
  error: string | null;
  landing: MaskView | null;
}

interface PendingScopeText {
  targets: string;
  layers: string;
  frames: string;
}

export type { DialogSpec, OtherFrame, PendingEdit, PendingOutcome, PendingScopeText, PendingSpec, PreviewFrame };
