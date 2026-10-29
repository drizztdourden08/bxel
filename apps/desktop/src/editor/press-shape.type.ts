/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';
import type { EditorTarget } from './editor.type';
import type { DrawPlan } from './press-plan.type';
import type { ShapeAnchor } from './shape-anchor.type';

type ShapePress = {
  readonly target: EditorTarget;
  readonly plan: DrawPlan;
  readonly at: Point;
  readonly constrain: boolean;
  readonly anchor: ShapeAnchor;
};

type PathPress = {
  readonly target: EditorTarget;
  readonly plan: Extract<DrawPlan, { kind: 'path' }>;
  readonly at: Point;
  readonly points: { current: Point[] };
};

export type { PathPress, ShapePress };
