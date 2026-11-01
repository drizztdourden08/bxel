/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { DrawingSettings } from '../stores/drawing-store.type';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';
import { beginStroke } from './begin-stroke';
import { brushOptions } from './brush-options';
import { brushPatch } from './brush-patch';
import type { BrushPatch, EditorTarget, PaintSession } from './editor.type';
import type { InkChoice } from './ink-of.type';
import { extendStroke } from './extend-stroke';
import { isInverse } from './is-inverse';
import type { StrokePlan } from './press-plan.type';
import { ratioSnap } from './ratio-snap';
import { ruleOf } from './rule-of';
import { strokeChoice } from './stroke-choice';
import { wrapOf } from './wrap-of';

const customOf = (plan: StrokePlan, drawing: DrawingSettings, choice: InkChoice): BrushPatch | null =>
  plan.tool === 'pencil' && plan.shade !== true && choice.ink?.kind !== 'pattern' ? brushPatch(drawing, choice.index) : null;

const startStroke = (plan: StrokePlan, target: EditorTarget, at: Point): PaintSession => {
  const tools = useToolStore.getState();
  const drawing = useDrawingStore.getState();
  const choice = strokeChoice(plan, tools, drawing, at);
  const custom = customOf(plan, drawing, choice);
  const options = {
    ...brushOptions(tools, target.sprite, at),
    wrap: wrapOf(),
    ...(choice.ink ? { ink: choice.ink } : {}),
    rule: ruleOf(target, choice.ink),
    custom,
  };
  const from = plan.line ? tools.lastPoint : null;
  const end = plan.snap && from ? ratioSnap(from, at).to : at;
  const inverse = plan.tool === 'eraser' && isInverse(plan.slot);
  const session = beginStroke({ target, tool: plan.tool, index: choice.index, inverse, options, at: from ?? end });
  if (from) extendStroke(session, end);
  return session;
};

export { startStroke };
