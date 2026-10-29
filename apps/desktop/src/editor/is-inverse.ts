/* @layer renderer-app @kind logic */
import type { ColourSlot } from './press-plan.type';

const isInverse = (slot: ColourSlot): boolean => slot === 'background' || slot === 'fourth';

export { isInverse };
