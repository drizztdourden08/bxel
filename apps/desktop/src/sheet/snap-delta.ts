/* @layer renderer-app @kind logic */
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

const snapAxis = (origin: number, delta: number, step: number | null, guides: readonly number[], reach: number): number => {
  const at = origin + delta;
  const gridded = step === null ? null : Math.round(at / step) * step;
  const near = guides.filter((line) => Math.abs(line - at) <= reach);
  const candidates = [...(gridded === null ? [] : [gridded]), ...near];
  if (candidates.length === 0) return delta;
  const best = candidates.reduce((closest, each) => (Math.abs(each - at) < Math.abs(closest - at) ? each : closest));
  return best - origin;
};

const snapDelta = ({ items, ids, delta, grid, lines, reach }: SnapRequest): Point => {
  const moved = items.filter((item) => ids.includes(item.sprite.id));
  if (moved.length === 0) return delta;
  const left = Math.min(...moved.map((item) => item.at.x));
  const top = Math.min(...moved.map((item) => item.at.y));
  return {
    x: snapAxis(left, delta.x, grid?.width ?? null, lines?.x ?? [], reach),
    y: snapAxis(top, delta.y, grid?.height ?? null, lines?.y ?? [], reach),
  };
};

export { snapDelta };
