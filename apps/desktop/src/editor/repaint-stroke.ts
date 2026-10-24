/* @layer renderer-app @kind logic */
import type { StrokeSession } from './editor.type';
import { paintPoints } from './paint-points';
import { refreshRect } from './refresh-rect';
import { restoreRect } from './restore-rect';
import { unionDirty } from './union-dirty';

const repaintStroke = (session: StrokeSession): void => {
  const before = session.dirty;
  if (before) restoreRect(session, before);
  const painted = paintPoints(session, session.points);
  session.dirty = painted;
  const changed = unionDirty(before, painted);
  if (changed) refreshRect(session, changed);
};

export { repaintStroke };
