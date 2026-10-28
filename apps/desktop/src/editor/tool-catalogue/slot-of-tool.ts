/* @layer renderer-app @kind logic */
import type { Surface } from './surface.type';
import type { ToolId } from '../tool.type';
import { slotsOf } from './slots-of';
import type { ToolSlot } from './tool-catalogue.type';

const slotOfTool = (surface: Surface, tool: ToolId): ToolSlot | undefined => slotsOf(surface).find((slot) => slot.tool === tool);

export { slotOfTool };
