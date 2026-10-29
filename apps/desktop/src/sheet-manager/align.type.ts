/* @layer renderer-app @kind types */
import type { Point, SpriteId } from '@bxel/document';

type AlignEdge = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

type AlignMode = AlignEdge | 'horizontal' | 'vertical';

interface AlignBox<Id extends string = SpriteId> {
  id: Id;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AlignMove<Id extends string = SpriteId> {
  id: Id;
  at: Point;
}

interface AlignBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export type { AlignBounds, AlignBox, AlignEdge, AlignMode, AlignMove };
