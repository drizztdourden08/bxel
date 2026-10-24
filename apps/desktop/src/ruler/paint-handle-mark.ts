/* @layer renderer-app @kind logic */
import { RULER_SIZES } from './ruler.constants';
import type { RulerFrame, RulerSpan } from './ruler.type';
import { fillAlong } from './fill-along';
import { handlePosition } from './handle-position';
import { rulerPoint } from './ruler-point';

const paintHandleMark = (frame: RulerFrame, span: RulerSpan, doubled: number): void => {
  const { ctx, axis, look, thickness } = frame;
  const at = Math.round(handlePosition(doubled, span));
  const tip = rulerPoint(axis, at, thickness);
  const left = rulerPoint(axis, at - RULER_SIZES.handleHalf, thickness - RULER_SIZES.handleHeight);
  const right = rulerPoint(axis, at + RULER_SIZES.handleHalf, thickness - RULER_SIZES.handleHeight);
  ctx.fillStyle = look.axis;
  ctx.beginPath();
  ctx.moveTo(tip[0], tip[1]);
  ctx.lineTo(left[0], left[1]);
  ctx.lineTo(right[0], right[1]);
  ctx.closePath();
  ctx.fill();
  fillAlong(frame, { along: at, across: 0, alongSize: 1, acrossSize: thickness });
};

export { paintHandleMark };
