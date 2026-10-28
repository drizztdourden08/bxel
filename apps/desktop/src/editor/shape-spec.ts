/* @layer renderer-app @kind logic */
import { brushOf } from './brush-of';
import type { ShapeSpec } from './editor.type';
import { PARTNER } from './ink-of.constants';
import { inkOf } from './ink-of';
import type { ShapeInput } from './shape-spec.type';
import { ruleOf } from './rule-of';
import { symmetryOf } from './symmetry-of';
import { wrapOf } from './wrap-of';

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
    brush: brushOf(tools),
    symmetry: symmetryOf(tools, size),
    wrap: wrapOf(),
    ...(choice.ink ? { ink: choice.ink } : {}),
    rule: ruleOf(target, choice.ink),
    from: at,
    to: at,
  };
};

export { shapeSpec };
