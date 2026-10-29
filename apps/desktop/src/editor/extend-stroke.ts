/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';
import type { StrokeSession } from './editor.type';
import { extendPerfect } from './extend-perfect';
import { paintPoints } from './paint-points';
import { refreshRect } from './refresh-rect';
import { repaintStroke } from './repaint-stroke';
import { unionDirty } from './union-dirty';

const needsRepaint = (session: StrokeSession): boolean => {
  const { rule, custom, pixelPerfect } = session.options;
  return custom !== null && custom !== undefined ? true : rule !== null && rule !== undefined && (rule.once || pixelPerfect);
};

const extendStroke = (session: StrokeSession, at: Point): void => {
  const last = session.points.at(-1);
  if (last?.x === at.x && last.y === at.y) return;
  session.points.push(at);
  if (needsRepaint(session)) {
    repaintStroke(session);
    return;
  }
  if (session.options.pixelPerfect) {
    extendPerfect(session, at);
    return;
  }
  const painted = paintPoints(session, last ? [last, at] : [at]);
  session.dirty = unionDirty(session.dirty, painted);
  if (painted) refreshRect(session, painted);
};

export { extendStroke };
