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

export type { ShapePress };
