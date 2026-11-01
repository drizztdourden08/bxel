/* @layer renderer-app @kind logic */
import { useSkillometerStore } from '../../stores/useSkillometerStore';
import { currentSurface } from '../tool-catalogue/current-surface';
import { slotOfTool } from '../tool-catalogue/slot-of-tool';
import { TOOL_SLOTS } from '../tool-catalogue/tool-catalogue.constants';
import type { ToolId } from '../tool.type';
import { SKILLOMETER_PICKS, skillometerHint } from './skillometer.constants';
import { showCycleNotice } from './show-cycle-notice';

const noteToolPick = (tool: ToolId): void => {
  const meter = useSkillometerStore.getState();
  const picks = meter.count(tool);
  if (picks < SKILLOMETER_PICKS || meter.told.includes(tool)) return;
  const slot = slotOfTool(currentSurface(), tool) ?? TOOL_SLOTS.find((each) => each.tool === tool);
  if (!slot || slot.key === '') return;
  meter.markTold(tool);
  showCycleNotice(skillometerHint(slot.label, slot.key));
};

export { noteToolPick };
