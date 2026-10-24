/* @layer core @kind logic */
import { parseHex } from '@bxel/palette';
import type { ColourModel } from '../model/preset.type';
import { nearestMember } from './nearest-member';
import { snapRgbBits } from './snap-rgb-bits';

const makeSnapper = (model: ColourModel): ((rgb: number) => number) => {
  if (model.kind !== 'fixedSet') return (rgb) => snapRgbBits(rgb, model.bits);
  const members = model.colours.map((hex) => parseHex(hex) ?? 0);
  return (rgb) => nearestMember(rgb, members);
};

export { makeSnapper };
