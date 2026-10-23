/* @layer renderer-app @kind logic */
import { paintStroke } from '@bxel/raster';
import type { Point } from '@bxel/raster';
import type { StrokeSession } from './editor.type';
import { refreshRect } from './refresh-rect';

const extendStroke = (session: StrokeSession, at: Point): void => {
  const last = session.points.at(-1);
  if (last?.x === at.x && last.y === at.y) return;
  session.points.push(at);
  const rect = paintStroke({
    target: { pixels: session.indices, width: session.width, height: session.height },
    index: session.index,
    points: last ? [last, at] : [at],
    brush: session.brush,
  });
  if (rect) refreshRect(session, rect);
};

export { extendStroke };
