/* @layer renderer-app @kind logic */
import type { Pivot2, Sprite } from '@bxel/document';
import type { PivotMode } from './manager.type';

const clampTo = (value: number, limit: number): number => Math.min(limit, Math.max(0, Math.round(value)));

const inside = (sprite: Sprite, x2: number, y2: number): Pivot2 => ({ x2: clampTo(x2, 2 * sprite.width), y2: clampTo(y2, 2 * sprite.height) });

const pivotFor = (sprite: Sprite, mode: PivotMode, first: Sprite | undefined): Pivot2 => {
  if (mode.kind === 'preset') return inside(sprite, 2 * sprite.width * mode.fx, 2 * sprite.height * mode.fy);
  if (mode.kind === 'exact') return inside(sprite, 2 * mode.x, 2 * mode.y);
  const source = first ?? sprite;
  return inside(sprite, source.pivot.x2, source.pivot.y2);
};

export { pivotFor };
