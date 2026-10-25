/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { useToolStore } from '../stores/useToolStore';
import { beginShape } from './begin-shape';
import { beginStroke } from './begin-stroke';
import { brushOptions } from './brush-options';
import type { EditorTarget, PaintSession } from './editor.type';
import { extendStroke } from './extend-stroke';
import type { DrawPlan } from './press-plan.type';
import { shapeSpec } from './shape-spec';
import { wrapOf } from './wrap-of';

const startSession = (plan: DrawPlan, target: EditorTarget, at: Point): PaintSession => {
  const tools = useToolStore.getState();
  const index = tools[plan.slot];
  if (plan.kind === 'shape') return beginShape({ target, spec: { ...shapeSpec(tools, target.sprite, index, at), wrap: wrapOf() } });
  const from = plan.line ? tools.lastPoint : null;
  const options = { ...brushOptions(tools, target.sprite), wrap: wrapOf() };
  const session = beginStroke({ target, tool: plan.tool, index, options, at: from ?? at });
  if (from) extendStroke(session, at);
  return session;
};

export { startSession };
