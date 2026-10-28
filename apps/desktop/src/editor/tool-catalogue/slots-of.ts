/* @layer renderer-app @kind logic */
import type { Surface } from '../../surface/surface.type';
import { drawSurface } from './draw-surface';
import { SLOT_GROUPS, TOOL_SLOTS } from './tool-catalogue.constants';
import type { ToolSlot } from './tool-catalogue.type';

const groupRank = (slot: ToolSlot): number => SLOT_GROUPS.findIndex((group) => group.id === slot.group);

const slotsOf = (surface: Surface): ToolSlot[] => {
  const own = drawSurface(surface);
  return TOOL_SLOTS.filter((slot) => slot.surfaces.includes(own)).sort((a, b) => groupRank(a) - groupRank(b));
};

export { slotsOf };
