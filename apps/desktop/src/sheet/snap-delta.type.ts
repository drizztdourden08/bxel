/* @layer renderer-app @kind types */
import type { Point, Size, SpriteId } from '@bxel/document';
import type { GuideLines } from '../guides/guide.type';
import type { SheetItem } from './sheet.type';

interface SnapRequest {
  items: readonly SheetItem[];
  ids: readonly SpriteId[];
  delta: Point;
  grid: Size | null;
  lines: GuideLines | undefined;
  reach: number;
}

interface SnapAxis {
  origin: number;
  delta: number;
  step: number | null;
  guides: readonly number[];
  reach: number;
}

export type { SnapAxis, SnapRequest };
