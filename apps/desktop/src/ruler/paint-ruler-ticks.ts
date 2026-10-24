/* @layer renderer-app @kind logic */
import { RULER_SIZES } from './ruler.constants';
import type { RulerFrame, RulerSpan } from './ruler.type';
import { fillAlong } from './fill-along';
import { rulerTicks } from './ruler-ticks';

const paintLabel = (frame: RulerFrame, text: string, at: number): void => {
  const { ctx, axis } = frame;
  ctx.save();
  ctx.textBaseline = 'top';
  if (axis === 'x') {
    ctx.fillText(text, at + RULER_SIZES.labelInset, 1);
  } else {
    ctx.translate(RULER_SIZES.font + 1, at + RULER_SIZES.labelInset);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(text, 0, 0);
  }
  ctx.restore();
};

const paintRulerTicks = (frame: RulerFrame, span: RulerSpan): void => {
  const { ctx, look, thickness } = frame;
  ctx.fillStyle = look.ground;
  fillAlong(frame, { along: 0, across: 0, alongSize: frame.length, acrossSize: thickness });
  ctx.fillStyle = look.line;
  fillAlong(frame, { along: 0, across: thickness - 1, alongSize: frame.length, acrossSize: 1 });
  ctx.font = look.font;
  rulerTicks(span).forEach((tick) => {
    const size = tick.label ? RULER_SIZES.majorTick : RULER_SIZES.minorTick;
    ctx.fillStyle = look.line;
    fillAlong(frame, { along: Math.round(tick.at), across: thickness - size, alongSize: 1, acrossSize: size });
    if (!tick.label) return;
    ctx.fillStyle = look.text;
    paintLabel(frame, String(tick.value), Math.round(tick.at));
  });
};

export { paintRulerTicks };
