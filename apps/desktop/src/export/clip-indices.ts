/* @layer renderer-app @kind logic */
import { upscaleIndexed } from '@bxel/formats';
import type { ExportFrame, ExportSprite } from '@bxel/formats';

const clipIndices = (sprite: ExportSprite, frame: ExportFrame, scale: number): Uint8Array => {
  const image = {
    indices: frame.layers[0] ?? new Uint8Array(sprite.width * sprite.height),
    palette: sprite.palette,
    width: sprite.width,
    height: sprite.height,
  };
  return (scale === 1 ? image : upscaleIndexed(image, scale)).indices;
};

export { clipIndices };
