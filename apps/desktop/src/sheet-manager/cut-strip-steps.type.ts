/* @layer renderer-app @kind types */
import type { Point, Sheet } from '@bxel/document';

interface StripPlace {
  sheet: Sheet;
  at: Point;
}

export type { StripPlace };
