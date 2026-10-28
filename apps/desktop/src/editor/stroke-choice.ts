/* @layer renderer-app @kind logic */
import type { DrawingSettings } from '../stores/drawing-store.type';
import type { ToolSettings } from '../stores/tool-store.type';
import { eraserChoice } from './eraser-choice';
import { inkOf } from './ink-of';
import type { InkChoice } from './ink-of.type';
import type { StrokePlan } from './press-plan.type';

const strokeChoice = (plan: StrokePlan, tools: ToolSettings, drawing: DrawingSettings): InkChoice => {
  if (plan.tool === 'eraser') return eraserChoice(plan.slot, tools);
  return inkOf(plan.slot, tools, plan.shade === true ? { ...drawing, inkKind: drawing.shadeMode } : drawing);
};

export { strokeChoice };
