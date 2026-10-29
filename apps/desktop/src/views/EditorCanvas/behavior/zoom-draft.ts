/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/raster';

interface ZoomDraft {
  from: Point;
  to: Point;
}

const zoomDraft: { current: ZoomDraft | null } = { current: null };

export { zoomDraft };
export type { ZoomDraft };
