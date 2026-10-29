/* @layer core @kind logic */
import type { MaskView } from '../buffer.type';
import type { Connectivity } from '../fill.type';
import { emptyMask } from './empty-mask';
import { isOn } from './count-on';
import { ringNeighbours } from './ring-neighbours';

type Side = 'inside' | 'outside';

const touches = (mask: MaskView, at: { x: number; y: number }, wanted: boolean, steps: ReturnType<typeof ringNeighbours>): boolean =>
  steps.some(([dx, dy]) => isOn(mask, at.x + dx, at.y + dy) === wanted);

const outlineMask = (mask: MaskView, side: Side, connectivity: Connectivity): MaskView => {
  const ring = emptyMask(mask);
  const steps = ringNeighbours(connectivity);
  for (let y = 0; y < mask.height; y++) {
    for (let x = 0; x < mask.width; x++) {
      const inside = isOn(mask, x, y);
      const edge = side === 'inside' ? inside && touches(mask, { x, y }, false, steps) : !inside && touches(mask, { x, y }, true, steps);
      if (edge) ring.bits[y * mask.width + x] = 1;
    }
  }
  return ring;
};

export { outlineMask };
export type { Side };
