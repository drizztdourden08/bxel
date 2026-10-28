/* @layer renderer-app @kind logic */
import type { DrawingSettings } from '../stores/drawing-store.type';
import type { ToolSettings } from '../stores/tool-store.type';
import { INK_BUILDERS, PARTNER } from './ink-of.constants';
import type { InkChoice } from './ink-of.type';
import type { ColourSlot } from './press-plan.type';

const inkOf = (slot: ColourSlot, tools: ToolSettings, drawing: DrawingSettings): InkChoice => {
  const context = { other: tools[PARTNER[slot]], reversed: slot === 'background' || slot === 'fourth', drawing };
  return { index: tools[slot], ink: INK_BUILDERS[drawing.inkKind](context) };
};

export { inkOf };
