/* @layer renderer-app @kind logic */
import type { Size } from '@bxel/raster';
import type { DrawingSettings } from '../stores/drawing-store.type';
import type { ToolSettings } from '../stores/tool-store.type';
import { brushOf } from './brush-of';
import type { EditorTarget, PathSpec } from './editor.type';
import { inkOf, PARTNER } from './ink-of';
import type { ColourSlot } from './press-plan.type';
import { ruleOf } from './rule-of';
import { symmetryOf } from './symmetry-of';
import type { PathTool } from './tool.type';
import { wrapOf } from './wrap-of';

type PathInput = {
  readonly tools: ToolSettings;
  readonly drawing: DrawingSettings;
  readonly target: EditorTarget;
  readonly size: Size;
  readonly tool: PathTool;
  readonly slot: ColourSlot;
};

const perfectOf = (tool: PathTool, drawing: DrawingSettings): boolean => {
  if (tool === 'curve') return drawing.curvePerfect;
  return tool === 'contour' && drawing.contourPerfect;
};

const pathSpec = ({ tools, drawing, target, size, tool, slot }: PathInput): PathSpec => {
  const choice = inkOf(slot, tools, drawing);
  const filled = drawing.filled[tool];
  return {
    filled,
    ...(filled && drawing.fillColour === 'back' ? { fillIndex: tools[PARTNER[slot]] } : {}),
    index: choice.index,
    brush: brushOf(tools),
    symmetry: symmetryOf(tools, size),
    wrap: wrapOf(),
    ...(choice.ink ? { ink: choice.ink } : {}),
    rule: ruleOf(target, choice.ink),
    pixelPerfect: perfectOf(tool, drawing),
  };
};

export { pathSpec };
