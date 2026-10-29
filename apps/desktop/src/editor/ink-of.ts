/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { DrawingSettings } from '../stores/drawing-store.type';
import { inkFor } from '../stores/ink-for';
import type { ToolSettings } from '../stores/tool-store.type';
import { INK_BUILDERS, ORIGIN, PARTNER } from './ink-of.constants';
import type { InkChoice } from './ink-of.type';
import type { ColourSlot } from './press-plan.type';

const inkOf = (slot: ColourSlot, tools: ToolSettings, drawing: DrawingSettings, origin: Point = ORIGIN): InkChoice => {
  const context = { other: tools[PARTNER[slot]], reversed: slot === 'background' || slot === 'fourth', drawing, origin };
  return { index: tools[slot], ink: INK_BUILDERS[inkFor(drawing, tools.tool)](context) };
};

export { inkOf };
