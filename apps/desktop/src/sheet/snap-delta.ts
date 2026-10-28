/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import type { SnapAxis, SnapRequest } from './snap-delta.type';

const snapAxis = ({ origin, delta, step, guides, reach }: SnapAxis): number => {
  const at = origin + delta;
  const gridded = step === null ? [] : [Math.round(at / step) * step];
  const candidates = [...gridded, ...guides.filter((line) => Math.abs(line - at) <= reach)];
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
    x: snapAxis({ origin: left, delta: delta.x, step: grid?.width ?? null, guides: lines?.x ?? [], reach }),
    y: snapAxis({ origin: top, delta: delta.y, step: grid?.height ?? null, guides: lines?.y ?? [], reach }),
  };
};

export { snapDelta };
