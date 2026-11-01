/* @layer renderer-app @kind types */
import type { Rect, SliceId } from '@bxel/document';
import type { CentreEdge } from './centre-edge.type';
import type { SliceHandle } from './slice-handle.type';

type SliceDrag =
  | { kind: 'new'; from: { x: number; y: number }; rect: Rect }
  | { kind: 'resize'; id: SliceId; handle: SliceHandle; origin: Rect; rect: Rect }
  | { kind: 'centre'; id: SliceId; edge: CentreEdge; rect: Rect; start: Rect; centre: Rect }
  | { kind: 'move'; id: SliceId; start: { x: number; y: number }; origin: Rect; rect: Rect };

export type { SliceDrag };
