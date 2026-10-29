/* @layer core @kind logic */
import type { Rect } from '../../geometry.type';
import type { NearPair } from './merge-near-boxes.type';
import { rectsNear } from './rects-near';
import { rectsUnion } from './rects-union';

const nearPair = (list: readonly Rect[], gap: number): NearPair | null => {
  for (let first = 0; first < list.length; first += 1) {
    for (let second = first + 1; second < list.length; second += 1) {
      const a = list[first];
      const b = list[second];
      if (a && b && rectsNear(a, b, gap)) return { first, second, joined: rectsUnion(a, b) };
    }
  }
  return null;
};

const mergeNearBoxes = (boxes: readonly Rect[], gap: number): Rect[] => {
  let list = [...boxes];
  let pair = gap > 0 ? nearPair(list, gap) : null;
  while (pair) {
    const { first, second, joined } = pair;
    list = [...list.filter((_box, at) => at !== first && at !== second), joined];
    pair = nearPair(list, gap);
  }
  return list;
};

export { mergeNearBoxes };
