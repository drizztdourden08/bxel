/* @layer renderer-app @kind logic */
import { paintStroke } from '@bxel/raster';
import type { Point, Size } from '@bxel/raster';
import type { ToolSettings } from '../../stores/tool-store.type';
import { brushOf } from '../brush-of';
import { symmetryOf } from '../symmetry-of';
import { PAINTED } from './quick-mask.constants';

const stampQuickMask = (scratch: Uint8Array, size: Size, points: readonly Point[], settings: ToolSettings): void => {
  paintStroke({
    target: { pixels: scratch, width: size.width, height: size.height },
    index: PAINTED,
    points,
    brush: brushOf(settings),
    pixelPerfect: false,
    symmetry: symmetryOf(settings, size),
  });
};

export { stampQuickMask };
