/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';

type SelectVariant = 'rect' | 'ellipse' | 'lasso' | 'polygon' | 'wand' | 'colour';

type MatchKind = 'exact' | 'ramp' | 'similar';

type SampleSource = 'layer' | 'visible' | 'all';

type FixedMarquee = 'free' | 'ratio' | 'size';

interface Clip {
  width: number;
  height: number;
  origin: Point;
  pixels: Uint8Array;
  bits: Uint8Array;
}

interface DragShape {
  variant: SelectVariant;
  from: Point;
  to: Point;
  path: readonly Point[];
  anchor?: number | null;
}

interface MarqueeRule {
  fixed: FixedMarquee;
  width: number;
  height: number;
}

interface DragKeys {
  shiftAtPress: boolean;
  altAtPress: boolean;
  shiftReleased: boolean;
  altReleased: boolean;
}

interface ShapeHold {
  square: boolean;
  centre: boolean;
}

type VertexSnap = 'centre' | 'corner';

export type { Clip, DragKeys, DragShape, FixedMarquee, MarqueeRule, MatchKind, SampleSource, SelectVariant, ShapeHold, VertexSnap };
