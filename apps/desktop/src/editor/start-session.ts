/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';
import { beginGradient } from './begin-gradient';
import { beginPath } from './begin-path';
import { beginShape } from './begin-shape';
import type { EditorTarget, PaintSession } from './editor.type';
import { gradientSpec } from './gradient-spec';
import { pathSpec } from './path-spec';
import type { DrawPlan } from './press-plan.type';
import { shapeSpec } from './shape-spec';
import { spraySession } from './start-spray';
import { startStroke } from './start-stroke';

const startSession = (plan: DrawPlan, target: EditorTarget, at: Point): PaintSession => {
  const tools = useToolStore.getState();
  const drawing = useDrawingStore.getState();
  const size = target.sprite;
  switch (plan.kind) {
    case 'shape':
      return beginShape({ target, spec: shapeSpec({ tools, drawing, target, size, shape: plan.shape, slot: plan.slot, at }) });
    case 'path':
      return beginPath({ target, tool: plan.tool, spec: pathSpec({ tools, drawing, target, size, tool: plan.tool, slot: plan.slot }), at });
    case 'gradient':
      return beginGradient(target, gradientSpec({ tools, drawing, target, slot: plan.slot, at }));
    case 'spray':
      return spraySession(plan, target, at);
    case 'stroke':
      return startStroke(plan, target, at);
  }
};

export { startSession };
