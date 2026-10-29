/* @layer core @kind logic */
import type { Wrap } from '../wrap.type';
import type { BayerSize } from './gradient.type';

const divides = (side: number, extent: number): boolean => extent % side === 0;

const seamlessSide = (size: BayerSize, room: { readonly width: number; readonly height: number }, wrap: Wrap): BayerSize | 1 => {
  for (const side of [8, 4, 2] as const) {
    const fits = (wrap.x !== true || divides(side, room.width)) && (wrap.y !== true || divides(side, room.height));
    if (side <= size && fits) return side;
  }
  return 1;
};

export { seamlessSide };
