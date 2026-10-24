/* @layer renderer-app @kind logic */
import { paintStroke } from '@bxel/raster';
import type { Point, Rect } from '@bxel/raster';
import type { StrokeSession } from './editor.type';

const paintPoints = (session: StrokeSession, points: readonly Point[]): Rect | null =>
  paintStroke({
    target: { pixels: session.indices, width: session.width, height: session.height },
    index: session.index,
    points,
    brush: session.options.brush,
    pixelPerfect: session.options.pixelPerfect,
    symmetry: session.options.symmetry,
  });

export { paintPoints };
