/* @layer renderer-app @kind logic */
import { brushStamp, stampPoints } from '@bxel/raster';
import type { Point } from '@bxel/raster';
import { clearFootprints } from './clear-footprints';
import type { StrokeSession } from './editor.type';
import { nearPoints } from './near-points';
import { perfectChanges } from './perfect-changes';
import { refreshRect } from './refresh-rect';
import { unionDirty } from './union-dirty';

const extendPerfect = (session: StrokeSession, at: Point): void => {
  const { brush } = session.options;
  const stamp = brushStamp(brush);
  const changes = perfectChanges(session, at, stamp.size);
  const gone = changes.flatMap((change) => change.removed);
  const fresh = changes.flatMap((change) => change.added);
  const cleared = clearFootprints(session, stamp, gone);
  const again = gone.length > 0 ? nearPoints(session.trails, gone, stamp.size) : [];
  const target = { pixels: session.indices, width: session.width, height: session.height };
  const painted = stampPoints({ target, index: session.index, mask: session.mask }, brush, [...again, ...fresh]);
  const changed = unionDirty(cleared, painted);
  session.dirty = unionDirty(session.dirty, changed);
  if (changed) refreshRect(session, changed);
};

export { extendPerfect };
