/* @layer renderer-app @kind logic */
import { CURSOR_ALPHA } from './ruler.constants';
import type { RulerFrame, RulerSpan } from './ruler.type';
import { fillAlong } from './fill-along';

const paintCursorMark = (frame: RulerFrame, span: RulerSpan, pixel: number): void => {
  const { ctx, look, thickness } = frame;
  const start = Math.round(span.origin + pixel * span.zoom);
  const size = Math.max(1, Math.round(span.zoom));
  ctx.save();
  ctx.fillStyle = look.cursor;
  ctx.globalAlpha = CURSOR_ALPHA;
  fillAlong(frame, { along: start, across: 0, alongSize: size, acrossSize: thickness - 1 });
  ctx.globalAlpha = 1;
  fillAlong(frame, { along: start + Math.floor(size / 2), across: 0, alongSize: 1, acrossSize: thickness - 1 });
  ctx.restore();
};

export { paintCursorMark };
