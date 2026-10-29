/* @layer core @kind types */
import type { Pivot2 } from '@bxel/document';
import type { Point } from '../geometry.type';

type Matrix2 = readonly [number, number, number, number];

type AffineSpec = {
  readonly scale: Point;
  readonly angle: number;
  readonly skew: Point;
  readonly offset: Point;
  readonly pivot?: Pivot2 | undefined;
  readonly matrix?: Matrix2 | undefined;
};

type Quad = readonly [Point, Point, Point, Point];

export type { AffineSpec, Matrix2, Quad };
