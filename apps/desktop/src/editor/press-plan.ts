/* @layer renderer-app @kind logic */
import type { PressEvent, PressPlan } from './press-plan.type';
import { drawSlot } from './draw-slot';
import { isPathTool, isShapeTool, isStrokeTool } from './is-stroke-tool';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from './tools.constants';
import type { ToolId } from './tool.type';

const pressPlan = (tool: ToolId, event: PressEvent): PressPlan | null => {
  if (event.button !== PRIMARY_BUTTON && event.button !== SECONDARY_BUTTON) return null;
  const slot = drawSlot(event);
  if (event.altKey || tool === 'picker') return { kind: 'pick', slot };
  if (tool === 'zoom') return { kind: 'zoom', out: event.button === SECONDARY_BUTTON };
  if (tool === 'fill') return { kind: 'fill', slot };
  if (isShapeTool(tool)) return { kind: 'shape', shape: tool, slot };
  if (isPathTool(tool)) return { kind: 'path', tool, slot };
  if (tool === 'gradient') return { kind: 'gradient', slot };
  if (tool === 'spray') return { kind: 'spray', slot };
  if (!isStrokeTool(tool)) return null;
  const snap = event.shiftKey && (event.ctrlKey === true || event.metaKey === true);
  return { kind: 'stroke', tool, slot, line: event.shiftKey, ...(snap ? { snap } : {}) };
};

export { pressPlan };
