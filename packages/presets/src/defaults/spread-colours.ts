/* @layer core @kind logic */
import type { ChannelBits } from '../model/preset.type';
import { cubeColour } from './cube-colour';
import { GOLDEN_FRACTION } from './defaults.constants';

const spreadColours = (
  bits: ChannelBits,
  wanted: number,
  taken: ReadonlySet<number>,
): number[] => {
  const total = 2 ** (bits[0] + bits[1] + bits[2]);
  const stride = Math.floor(total * GOLDEN_FRACTION) | 1;
  const found: number[] = [];
  for (let step = 0; step < total && found.length < wanted; step += 1) {
    const colour = cubeColour(bits, (step * stride) % total);
    if (!taken.has(colour)) found.push(colour);
  }
  return found;
};

export { spreadColours };
