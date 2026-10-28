/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useToolStore } from '../../stores/useToolStore';
import { currentSurface } from '../../surface/current-surface';
import { shownMember } from '../tool-catalogue/shown-member';
import { slotOfTool } from '../tool-catalogue/slot-of-tool';
import { surfaceKind } from '../tool-catalogue/surface-kind';
import type { ToolId } from '../tool.type';
import { pickMember } from './pick-member';

const cycleMember = (tool: ToolId, step: 1 | -1): boolean => {
  const slot = slotOfTool(currentSurface(), tool);
  if (!slot || slot.members.length < 2) return false;
  const { shape } = useToolStore.getState();
  const { variant } = useSelectionStore.getState();
  const at = slot.members.indexOf(shownMember(slot, { shape, variant }));
  const next = slot.members[(at + step + slot.members.length) % slot.members.length];
  if (next) pickMember(next);
  return next !== undefined;
};

const pressToolKey = (tool: ToolId, step: 1 | -1 = 1): void => {
  const tools = useToolStore.getState();
  if (tools.tool !== tool) {
    tools.setTool(tool);
    return;
  }
  if (cycleMember(tool, step)) return;
  if (tool === 'fill' && surfaceKind(currentSurface()) === 'paint') tools.selectTool(tool);
};

export { pressToolKey };
