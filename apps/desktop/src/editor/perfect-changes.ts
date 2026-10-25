/* @layer renderer-app @kind logic */
import { createTrail, extendTrail, mirrorPoints } from '@bxel/raster';
import type { Point, TrailChange } from '@bxel/raster';
import type { StrokeSession } from './editor.type';

const perfectChanges = (session: StrokeSession, at: Point, span: number): TrailChange[] => {
  const variants = mirrorPoints({ points: [at], symmetry: session.options.symmetry, span });
  while (session.trails.length < variants.length) session.trails.push(createTrail());
  return variants.map((variant, row) => {
    const trail = session.trails[row];
    const raw = variant[0];
    return trail && raw ? extendTrail(trail, raw) : { removed: [], added: [] };
  });
};

export { perfectChanges };
