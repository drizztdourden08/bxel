/* @layer renderer-app @kind constants */
import type { PlanBuilder } from './press-plan.constants.type';
import type { PressEvent } from './press-plan.type';
import { SECONDARY_BUTTON } from './tools.constants';
import type { ToolId } from './tool.type';

const wantsSnap = (event: PressEvent): boolean => event.shiftKey && (event.ctrlKey === true || event.metaKey === true);

const stroke = (tool: 'pencil' | 'eraser'): PlanBuilder => (slot, event) => ({
  kind: 'stroke',
  tool,
  slot,
  line: event.shiftKey,
  ...(wantsSnap(event) ? { snap: true } : {}),
});

const shape = (name: 'line' | 'rect' | 'ellipse'): PlanBuilder => (slot) => ({ kind: 'shape', shape: name, slot });

const path = (name: 'curve' | 'polygon' | 'contour'): PlanBuilder => (slot) => ({ kind: 'path', tool: name, slot });

const PLAN_BUILDERS: Readonly<Partial<Record<ToolId, PlanBuilder>>> = {
  pencil: stroke('pencil'),
  eraser: stroke('eraser'),
  shade: (slot, event) => ({ kind: 'stroke', tool: 'pencil', slot, line: event.shiftKey, shade: true }),
  spray: (slot) => ({ kind: 'spray', slot }),
  fill: (slot) => ({ kind: 'fill', slot }),
  gradient: (slot) => ({ kind: 'gradient', slot }),
  line: shape('line'),
  rect: shape('rect'),
  ellipse: shape('ellipse'),
  curve: path('curve'),
  polygon: path('polygon'),
  contour: path('contour'),
  zoom: (_slot, event) => ({ kind: 'zoom', out: event.button === SECONDARY_BUTTON }),
};

export { PLAN_BUILDERS };
