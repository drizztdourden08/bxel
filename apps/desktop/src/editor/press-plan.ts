/* @layer renderer-app @kind logic */
import type { PressEvent, PressPlan } from './press-plan.type';
import { drawSlot } from './draw-slot';
import { PLAN_BUILDERS } from './press-plan.constants';
import { PEN_ERASER_BUTTON, PRIMARY_BUTTON, SECONDARY_BUTTON } from './tools.constants';
import type { ToolId } from './tool.type';

const penEraser = (event: PressEvent): boolean => event.pointerType === 'pen' && event.button === PEN_ERASER_BUTTON;

const pressPlan = (tool: ToolId, event: PressEvent): PressPlan | null => {
  const erasing = penEraser(event);
  if (!erasing && event.button !== PRIMARY_BUTTON && event.button !== SECONDARY_BUTTON) return null;
  const slot = drawSlot(event);
  if (erasing) return PLAN_BUILDERS.eraser?.(slot, event) ?? null;
  if ((event.altKey && !event.shiftKey) || tool === 'picker') return { kind: 'pick', slot };
  return PLAN_BUILDERS[tool]?.(slot, event) ?? null;
};

export { pressPlan };
