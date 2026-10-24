/* @layer renderer-app @kind types */
import type { Point, SpriteId } from '@bxel/document';

type AlignEdge = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

type AlignMode = AlignEdge | 'horizontal' | 'vertical';

interface AlignBox {
  id: SpriteId;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AlignMove {
  id: SpriteId;
  at: Point;
}

interface AlignBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export type { AlignBounds, AlignBox, AlignEdge, AlignMode, AlignMove };
