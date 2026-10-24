/* @layer renderer-app @kind logic */
import { anchoredFrame, countOpaque } from '@bxel/raster';
import type { Sprite } from '@bxel/document';
import type { ResizeSpec } from './manager.type';

const spriteClips = (sprite: Sprite, spec: ResizeSpec): number => {
  const frame = anchoredFrame(sprite, spec, spec.anchor);
  return Object.values(sprite.cels).reduce(
    (sum, cel) => sum + countOpaque({ pixels: cel.pixels, width: sprite.width, height: sprite.height }, frame),
    0,
  );
};

const resizeClips = (sprites: readonly Sprite[], spec: ResizeSpec): number =>
  sprites.reduce((sum, sprite) => sum + spriteClips(sprite, spec), 0);

export { resizeClips };
