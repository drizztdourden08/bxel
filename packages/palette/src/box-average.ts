/* @layer core @kind logic */
import { channelOf } from './channel-of';
import type { ColorBox } from './extract.type';
import { packRgb } from './pack-rgb';

const boxAverage = (box: ColorBox): number => {
  let r = 0;
  let g = 0;
  let b = 0;
  for (const { rgb, count } of box.entries) {
    r += channelOf(rgb, 0) * count;
    g += channelOf(rgb, 1) * count;
    b += channelOf(rgb, 2) * count;
  }
  const { population } = box;
  const round = (sum: number): number => Math.floor((sum * 2 + population) / (population * 2));
  return packRgb(round(r), round(g), round(b));
};

export { boxAverage };
