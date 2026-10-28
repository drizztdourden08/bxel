/* @layer renderer-app @kind logic */
import { plotDots } from '@bxel/raster';
import type { SpraySession } from './editor.type';
import { refreshRect } from './refresh-rect';
import { restoreRect } from './restore-rect';
import { unionDirty } from './union-dirty';

const SINGLE = { shape: 'square', size: 1 } as const;

const paintSpray = (session: SpraySession): void => {
  const before = session.dirty;
  if (before) restoreRect(session, before);
  const { options } = session;
  const painted = plotDots({
    target: { pixels: session.indices, width: session.width, height: session.height },
    index: session.index,
    points: session.dots,
    brush: SINGLE,
    symmetry: options.symmetry,
    wrap: options.wrap,
    mask: session.mask,
    ink: options.rule,
  });
  session.dirty = painted;
  const changed = unionDirty(before, painted);
  if (changed) refreshRect(session, changed);
};

export { paintSpray };
