/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import { useToolStore } from '../../stores/useToolStore';
import { currentSurface } from '../../surface/current-surface';
import { shownMember } from '../tool-catalogue/shown-member';
import { slotOfTool } from '../tool-catalogue/slot-of-tool';
import type { ToolMember } from '../tool-catalogue/tool-catalogue.type';

const activeMember = (): ToolMember | undefined => {
  const { tool, shape } = useToolStore.getState();
  const slot = slotOfTool(currentSurface(), tool);
  return slot ? shownMember(slot, { shape, variant: useSelectionStore.getState().variant }) : undefined;
};

export { activeMember };
