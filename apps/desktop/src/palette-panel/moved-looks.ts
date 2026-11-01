/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { colourSpan } from './colour-span';
import { lookAt } from './look-at';
import type { Look } from './recolour-plan.type';

const movedLooks = (bank: PaletteBank, from: number, to: number): Map<number, Look> => {
  const range = colourSpan(from, to);
  const looks = range.map((index) => lookAt(bank, index));
  const moving = looks[from - Math.min(from, to)] ?? null;
  const rest = looks.filter((_, at) => range[at] !== from);
  const order = to > from ? [...rest, moving] : [moving, ...rest];
  const result = new Map<number, Look>();
  range.forEach((index, at) => {
    const look = order[at];
    if (look) result.set(index, look);
  });
  return result;
};

export { movedLooks };
