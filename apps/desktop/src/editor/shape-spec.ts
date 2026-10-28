/* @layer renderer-app @kind logic */
import type { Point, ShapeKind, Size } from '@bxel/raster';
import type { DrawingSettings } from '../stores/drawing-store.type';
import type { ToolSettings } from '../stores/tool-store.type';
import { brushOf } from './brush-of';
import type { EditorTarget, ShapeSpec } from './editor.type';
import { inkOf, PARTNER } from './ink-of';
import type { ColourSlot } from './press-plan.type';
import { ruleOf } from './rule-of';
import { symmetryOf } from './symmetry-of';
import { wrapOf } from './wrap-of';

type ShapeInput = {
  readonly tools: ToolSettings;
  readonly drawing: DrawingSettings;
  readonly target: EditorTarget;
  readonly size: Size;
  readonly shape: ShapeKind;
  readonly slot: ColourSlot;
  readonly at: Point;
};

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
