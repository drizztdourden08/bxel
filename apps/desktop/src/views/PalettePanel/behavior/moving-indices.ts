/* @layer renderer-app @kind logic */
import type { VirtualGridMove } from '@drizztdourden08/tessera';
import type { PaletteTarget } from '../../../editor/editor.type';

const movingIndices = (target: PaletteTarget, move: VirtualGridMove): number[] =>
  move.keys
    .map((key) => target.bank.slots.findIndex((slot) => String(slot.id) === key))
    .filter((index) => index >= 0)
    .sort((first, second) => first - second);

export { movingIndices };
