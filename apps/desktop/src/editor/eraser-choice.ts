/* @layer renderer-app @kind logic */
import type { EraseMode } from '../stores/drawing-store.type';
import type { ToolSettings } from '../stores/tool-store.type';
import { isInverse } from './is-inverse';
import { PARTNER } from './ink-of.constants';
import type { InkChoice } from './ink-of.type';
import type { ColourSlot } from './press-plan.type';

const eraserChoice = (slot: ColourSlot, tools: ToolSettings, mode: EraseMode = 'all'): InkChoice => {
  if (isInverse(slot)) return { index: tools[slot], ink: { kind: 'onlyColour', index: tools[PARTNER[slot]] } };
  return mode === 'colour' ? { index: 0, ink: { kind: 'onlyColour', index: tools[PARTNER[slot]] } } : { index: 0, ink: undefined };
};

export { eraserChoice };
