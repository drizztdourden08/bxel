/* @layer renderer-app @kind types */
import type { Pivot2 } from '@bxel/document';
import type { BoundsPolicy, Point, Quad, Rect, ResampleAlgorithm } from '@bxel/raster';

/** One transform session: every field maps onto the pixels.transform command, or pixels.distort when corners are set. */
interface TransformSpec {
  kind: 'transform';
  scale: Point;
  angle: number;
  skew: Point;
  offset: Point;
  pivot: Pivot2 | null;
  algorithm: ResampleAlgorithm;
  bounds: BoundsPolicy;
  corners: Quad | null;
}

type TransformField = 'x' | 'y' | 'width' | 'height' | 'angle' | 'skewX' | 'skewY';

type HandleKind = 'corner' | 'edge' | 'rotate' | 'pivot' | 'body';

interface Handle {
  kind: HandleKind;
  index: number;
}

type GrabMode = 'scale' | 'skew' | 'distort';

interface Grab {
  handle: Handle;
  mode: GrabMode;
  start: Point;
  spec: TransformSpec;
  box: Rect;
}

interface HeldKeys {
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
}

export type { Grab, GrabMode, Handle, HandleKind, HeldKeys, TransformField, TransformSpec };
