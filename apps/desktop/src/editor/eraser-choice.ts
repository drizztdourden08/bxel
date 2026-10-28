/* @layer renderer-app @kind logic */
import type { ToolSettings } from '../stores/tool-store.type';
import type { InkChoice } from './ink-of';
import { PARTNER } from './ink-of';
import type { ColourSlot } from './press-plan.type';

const isInverse = (slot: ColourSlot): boolean => slot === 'background' || slot === 'fourth';

const eraserChoice = (slot: ColourSlot, tools: ToolSettings): InkChoice =>
  isInverse(slot)
    ? { index: tools[slot], ink: { kind: 'onlyColour', index: tools[PARTNER[slot]] } }
    : { index: 0, ink: undefined };

export { eraserChoice, isInverse };
