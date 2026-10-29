/* @layer renderer-app @kind logic */
import { drawPath } from '@bxel/raster';
import type { PathSession } from './editor.type';
import { pathPoints } from './path-points';
import { restoreRect } from './restore-rect';
import { settlePaint } from './settle-paint';

const paintPath = (session: PathSession): void => {
  const before = session.dirty;
  if (before) restoreRect(session, before);
  const { spec } = session;
  const painted = drawPath({
    target: { pixels: session.indices, width: session.width, height: session.height },
    index: spec.index,
    kind: session.tool,
    points: pathPoints(session),
    filled: spec.filled,
    fillIndex: spec.fillIndex,
    pixelPerfect: spec.pixelPerfect,
    brush: spec.brush,
    symmetry: spec.symmetry,
    wrap: spec.wrap,
    mask: session.mask,
    ink: spec.rule,
  });
  settlePaint(session, before, painted);
};

export { paintPath };
