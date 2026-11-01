/* @layer renderer-app @kind types */
import type { DocumentId, FlipAxis, SpriteId, TurnDirection } from '@bxel/document';
import type { MaskView, Point, Rect } from '@bxel/raster';
import type { Clip } from '../selection/selection.type';
import type { TransformSpec } from '../transform/transform.type';

type PendingSpec =
  | { kind: 'flip'; axis: FlipAxis }
  | { kind: 'turn'; direction: TurnDirection }
  | TransformSpec
  | { kind: 'move'; offset: Point }
  | { kind: 'paste'; clip: Clip; offset: Point }
  | { kind: 'patch'; label: string; rect: Rect; pixels: Uint8Array };

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
}

export type { OtherFrame, PendingEdit, PendingOutcome, PendingScopeText, PendingSpec, PreviewFrame };
