/* @layer renderer-app @kind logic */
import type { ShapeSpec } from './editor.type';
import { PARTNER } from './ink-of.constants';
import { inkOf } from './ink-of';
import { paintParts } from './paint-parts';
import type { ShapeInput } from './shape-spec.type';

const shapeSpec = ({ tools, drawing, target, size, shape, slot, at }: ShapeInput): ShapeSpec => {
  const choice = inkOf(slot, tools, drawing);
  const filled = shape !== 'line' && drawing.filled[shape];
  return {
    shape,
    filled,
    ...(filled && drawing.fillColour === 'back' ? { fillIndex: tools[PARTNER[slot]] } : {}),
    radius: shape === 'rect' ? drawing.cornerRadius : 0,
    evenSteps: shape === 'line' && drawing.evenSteps,
    index: choice.index,
    ...paintParts(tools, target, size, choice),
    from: at,
    to: at,
  };
};

export { shapeSpec };
