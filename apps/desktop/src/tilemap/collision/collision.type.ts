/* @layer renderer-app @kind types */
import type { Point } from '@bxel/document';

type CollisionKind = 'none' | 'full' | 'rect' | 'polygon';

interface CollisionDrag {
  kind: 'rect' | 'point';
  from: Point;
  to: Point;
  index: number;
}

export type { CollisionDrag, CollisionKind };
