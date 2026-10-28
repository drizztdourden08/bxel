/* @layer renderer-app @kind logic */
import type { PressEvent, PressPlan } from './press-plan.type';
import { drawSlot } from './draw-slot';
import { PLAN_BUILDERS } from './press-plan.constants';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from './tools.constants';
import type { ToolId } from './tool.type';

const pressPlan = (tool: ToolId, event: PressEvent): PressPlan | null => {
  if (event.button !== PRIMARY_BUTTON && event.button !== SECONDARY_BUTTON) return null;
  const slot = drawSlot(event);
  if ((event.altKey && !event.shiftKey) || tool === 'picker') return { kind: 'pick', slot };
  return PLAN_BUILDERS[tool]?.(slot, event) ?? null;
};

export { pressPlan };
