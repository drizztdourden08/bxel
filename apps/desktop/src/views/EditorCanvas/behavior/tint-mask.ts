/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';
import { QUICK_MASK_ALPHA, TINT_PATHS } from '../EditorCanvas.constants';
import type { OverlayLook } from './canvas-tools.type';

const tintPath = (mask: MaskView): Path2D => {
  const cached = TINT_PATHS.get(mask);
  if (cached) return cached;
  const path = new Path2D();
  for (let y = 0; y < mask.height; y += 1) {
    let start = -1;
    for (let x = 0; x <= mask.width; x += 1) {
      const on = x < mask.width && mask.bits[y * mask.width + x] !== 0;
      if (on && start < 0) start = x;
      if (!on && start >= 0) {
        path.rect(start, y, x - start, 1);
        start = -1;
      }
    }
  }
  TINT_PATHS.set(mask, path);
  return path;
};

const tintMask = (ctx: CanvasRenderingContext2D, mask: MaskView, look: OverlayLook): void => {
  ctx.save();
  ctx.globalAlpha = QUICK_MASK_ALPHA;
  ctx.fillStyle = look.cursor;
  ctx.fill(tintPath(mask));
  ctx.restore();
};

export { tintMask };
