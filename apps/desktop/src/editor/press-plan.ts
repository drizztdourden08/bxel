/* @layer renderer-app @kind logic */
import type { ColourSlot, PressEvent, PressPlan } from './press-plan.type';
import { drawSlot } from './draw-slot';
import { PLAN_BUILDERS } from './press-plan.constants';
import { PEN_ERASER_BUTTON, PRIMARY_BUTTON, SECONDARY_BUTTON } from './tools.constants';
import type { ToolId } from './tool.type';

const penEraser = (event: PressEvent): boolean => event.pointerType === 'pen' && event.button === PEN_ERASER_BUTTON;

const pressButton = (event: PressEvent): boolean => event.button === PRIMARY_BUTTON || event.button === SECONDARY_BUTTON;

const pickPlan = (tool: ToolId, slot: ColourSlot, event: PressEvent): PressPlan | null => {
  if (tool === 'picker' && event.shiftKey) return { kind: 'pick', slot, ramp: true };
  if ((event.altKey && !event.shiftKey) || tool === 'picker') return { kind: 'pick', slot };
  return null;
};

const builtPlan = (tool: ToolId, slot: ColourSlot, event: PressEvent): PressPlan | null => PLAN_BUILDERS[tool]?.(slot, event) ?? null;

const pressPlan = (tool: ToolId, event: PressEvent): PressPlan | null => {
  const erasing = penEraser(event);
  if (!erasing && !pressButton(event)) return null;
  const slot = drawSlot(event);
  if (erasing) return builtPlan('eraser', slot, event);
  return pickPlan(tool, slot, event) ?? builtPlan(tool, slot, event);
};

export { pressPlan };
