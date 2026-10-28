/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';
import { beginGradient } from './begin-gradient';
import { beginPath } from './begin-path';
import { beginShape } from './begin-shape';
import { beginStroke } from './begin-stroke';
import { brushOptions } from './brush-options';
import { customStamp } from './custom-stamp';
import type { EditorTarget, PaintSession } from './editor.type';
import { eraserChoice, isInverse } from './eraser-choice';
import { extendStroke } from './extend-stroke';
import { gradientSpec } from './gradient-spec';
import { inkOf } from './ink-of';
import { pathSpec } from './path-spec';
import type { DrawPlan } from './press-plan.type';
import { ratioSnap } from './ratio-snap';
import { ruleOf } from './rule-of';
import { shapeSpec } from './shape-spec';
import { spraySession } from './start-spray';
import { wrapOf } from './wrap-of';

const startStroke = (plan: Extract<DrawPlan, { kind: 'stroke' }>, target: EditorTarget, at: Point): PaintSession => {
  const tools = useToolStore.getState();
  const drawing = useDrawingStore.getState();
  const choice = plan.tool === 'eraser' ? eraserChoice(plan.slot, tools) : inkOf(plan.slot, tools, drawing);
  const custom = plan.tool === 'pencil' ? customStamp(drawing, choice.index) : null;
  const options = {
    ...brushOptions(tools, target.sprite),
    wrap: wrapOf(),
    ...(choice.ink ? { ink: choice.ink } : {}),
    rule: ruleOf(target, choice.ink),
    custom,
  };
  const from = plan.line ? tools.lastPoint : null;
  const end = plan.snap && from ? ratioSnap(from, at).to : at;
  const session = beginStroke({ target, tool: plan.tool, index: choice.index, inverse: plan.tool === 'eraser' && isInverse(plan.slot), options, at: from ?? end });
  if (from) extendStroke(session, end);
  return session;
};

const startSession = (plan: DrawPlan, target: EditorTarget, at: Point): PaintSession => {
  const tools = useToolStore.getState();
  const drawing = useDrawingStore.getState();
  const size = target.sprite;
  switch (plan.kind) {
    case 'shape':
      return beginShape({ target, spec: shapeSpec({ tools, drawing, target, size, shape: plan.shape, slot: plan.slot, at }) });
    case 'path':
      return beginPath({ target, tool: plan.tool, spec: pathSpec({ tools, drawing, target, size, tool: plan.tool, slot: plan.slot }), at });
    case 'gradient': {
      const session = beginGradient(target, gradientSpec({ tools, drawing, target, slot: plan.slot, at }));
      return session;
    }
    case 'spray':
      return spraySession(plan, target, at);
    case 'stroke':
      return startStroke(plan, target, at);
  }
};

export { startSession };
