/* @layer renderer-app @kind logic */
import type { ToolSettings } from '../stores/tool-store.type';
import { isInverse } from './is-inverse';
import { PARTNER } from './ink-of.constants';
import type { InkChoice } from './ink-of.type';
import type { ColourSlot } from './press-plan.type';

const eraserChoice = (slot: ColourSlot, tools: ToolSettings): InkChoice =>
  isInverse(slot)
    ? { index: tools[slot], ink: { kind: 'onlyColour', index: tools[PARTNER[slot]] } }
    : { index: 0, ink: undefined };

export { eraserChoice };
