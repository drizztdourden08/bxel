/* @layer renderer-app @kind logic */
import { drawShape } from '@bxel/raster';
import type { ShapeSession } from './editor.type';
import { refreshRect } from './refresh-rect';
import { restoreRect } from './restore-rect';
import { unionDirty } from './union-dirty';

const paintShape = (session: ShapeSession): void => {
  const { spec } = session;
  const before = session.dirty;
  if (before) restoreRect(session, before);
  const painted = drawShape({
    target: { pixels: session.indices, width: session.width, height: session.height },
    index: spec.index,
    shape: spec.shape,
    from: spec.from,
    to: spec.to,
    filled: spec.filled,
    brush: spec.brush,
    symmetry: spec.symmetry,
  });
  session.dirty = painted;
  const changed = unionDirty(before, painted);
  if (changed) refreshRect(session, changed);
};

export { paintShape };
