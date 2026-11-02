/* @layer renderer-app @kind logic */
import { PACKINGS } from '@bxel/document';
import { pickedKey } from '../picked-key';
import { activeSet } from './active-set';
import { fillPacking } from './fill-packing';

const runFillLayout = (packing?: string, set?: string): boolean => {
  const target = activeSet(set);
  const chosen = packing ?? PACKINGS.find((each) => each.kind === target?.kind)?.id;
  return target && chosen ? fillPacking({ set: target.id, packing: chosen, start: pickedKey() }) : false;
};

export { runFillLayout };
