/* @layer renderer-app @kind logic */
import type { Brush, Point } from '@bxel/raster';
import { useToolStore } from '../stores/useToolStore';
import { beginStroke } from './begin-stroke';
import type { EditorTarget, StrokeSession } from './editor.type';
import type { PressPlan } from './press-plan.type';
import { BRUSH_SHAPE } from './stroke.constants';

const startStroke = (plan: Extract<PressPlan, { kind: 'stroke' }>, target: EditorTarget, at: Point): StrokeSession => {
  const tools = useToolStore.getState();
  const brush: Brush = { shape: BRUSH_SHAPE, size: tools.brushSize };
  return beginStroke({ target, tool: plan.tool, index: tools[plan.slot], brush, at });
};

export { startStroke };
