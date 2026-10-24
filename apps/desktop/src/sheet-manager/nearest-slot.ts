/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { colorDistance } from '@bxel/palette';
import { slotRgb } from './slot-rgb';

const nearestSlot = (rgb: number, dest: PaletteBank): number => {
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  dest.slots.forEach((slot, at) => {
    if (at === 0 || slot.kind !== 'color') return;
    const distance = colorDistance(rgb, slotRgb(dest, at));
    if (distance < bestDistance) {
      best = at;
      bestDistance = distance;
    }
  });
  return best;
};

export { nearestSlot };
