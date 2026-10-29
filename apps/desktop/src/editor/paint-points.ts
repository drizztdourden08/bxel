/* @layer renderer-app @kind logic */
import { paintStroke, stampPatch } from '@bxel/raster';
import type { Point, Rect } from '@bxel/raster';
import { customPoints } from './custom-points';
import type { StrokeSession } from './editor.type';

const paintPoints = (session: StrokeSession, points: readonly Point[]): Rect | null => {
  const target = { pixels: session.indices, width: session.width, height: session.height };
  const { custom, symmetry, wrap, rule } = session.options;
  if (custom) {
    return stampPatch({
      target,
      patch: custom.patch,
      points: customPoints(points),
      skipZero: true,
      flipX: custom.flipX,
      flipY: custom.flipY,
      turn: custom.turn,
      symmetry,
      wrap,
      mask: session.mask,
      ink: rule,
    });
  }
  return paintStroke({
    target,
    index: session.index,
    points,
    brush: session.options.brush,
    pixelPerfect: session.options.pixelPerfect,
    symmetry,
    wrap,
    mask: session.mask,
    ink: rule,
  });
};

export { paintPoints };
