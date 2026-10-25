/* @layer renderer-app @kind constants */
import type { Wrap } from '@bxel/raster';
import type { TileMode } from '../stores/view-store.type';

const WRAP_OF: Readonly<Record<TileMode, Wrap>> = {
  off: { x: false, y: false },
  x: { x: true, y: false },
  y: { x: false, y: true },
  both: { x: true, y: true },
};

export { WRAP_OF };
