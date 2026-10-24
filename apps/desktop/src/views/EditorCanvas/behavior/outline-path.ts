/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';
import { maskOutline } from '../../../editor/selection/mask-outline';
import { OUTLINE_PATHS } from '../EditorCanvas.constants';

const outlinePath = (mask: MaskView): Path2D => {
  const cached = OUTLINE_PATHS.get(mask);
  if (cached) return cached;
  const path = new Path2D();
  const lines = maskOutline(mask);
  for (let at = 0; at < lines.length; at += 4) {
    path.moveTo(lines[at] ?? 0, lines[at + 1] ?? 0);
    path.lineTo(lines[at + 2] ?? 0, lines[at + 3] ?? 0);
  }
  OUTLINE_PATHS.set(mask, path);
  return path;
};

export { outlinePath };
