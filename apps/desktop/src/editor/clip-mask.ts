/* @layer renderer-app @kind logic */
import { rectMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import type { EditorTarget } from './editor.type';

const clipMask = (target: EditorTarget): MaskView | null => {
  const clip = target.animation?.frame.clip;
  if (!clip) return null;
  const size = { width: target.sprite.width, height: target.sprite.height };
  return rectMask(size, { from: { x: clip.x, y: clip.y }, to: { x: clip.x + clip.width - 1, y: clip.y + clip.height - 1 } });
};

export { clipMask };
