/* @layer renderer-app @kind logic */
import type { Rect } from '@bxel/raster';
import type { Overlay } from './editor.type';
import { refreshRect } from './refresh-rect';
import { unionDirty } from './union-dirty';

const settlePaint = (session: Overlay, before: Rect | null, painted: Rect | null): void => {
  session.dirty = painted;
  const changed = unionDirty(before, painted);
  if (changed) refreshRect(session, changed);
};

export { settlePaint };
