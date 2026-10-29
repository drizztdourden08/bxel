/* @layer renderer-app @kind logic */
import type { DrawingSettings } from '../stores/drawing-store.type';
import type { PathSpec } from './editor.type';
import { PARTNER } from './ink-of.constants';
import { inkOf } from './ink-of';
import { paintParts } from './paint-parts';
import type { PathInput } from './path-spec.type';
import type { PathTool } from './tool.type';

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
    ...paintParts(tools, target, size, choice),
    pixelPerfect: perfectOf(tool, drawing),
    ...(tool === 'curve' && drawing.curveCubic ? { cubic: true } : {}),
  };
};

export { pathSpec };
