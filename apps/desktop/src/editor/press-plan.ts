/* @layer renderer-app @kind logic */
import type { PressEvent, PressPlan } from './press-plan.type';
import { isStrokeTool } from './is-stroke-tool';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from './tools.constants';
import type { ToolId } from './tool.type';

const pressPlan = (tool: ToolId, event: PressEvent): PressPlan | null => {
  if (event.button !== PRIMARY_BUTTON && event.button !== SECONDARY_BUTTON) return null;
  const slot = event.button === SECONDARY_BUTTON ? 'background' : 'foreground';
  if (event.altKey || tool === 'picker') return { kind: 'pick', slot };
  if (tool === 'zoom') return { kind: 'zoom', out: event.button === SECONDARY_BUTTON };
  if (tool === 'fill') return { kind: 'fill', slot };
  if (tool === 'shape') return { kind: 'shape', slot };
  return isStrokeTool(tool) ? { kind: 'stroke', tool, slot, line: event.shiftKey } : null;
};

export { pressPlan };
