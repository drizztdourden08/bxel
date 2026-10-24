/* @layer core @kind logic */
import type { RgbaImage } from '../png.type';
import type { TileBox } from './crop-tile.type';
import { RGBA_CHANNELS } from './tiled.constants';

const cropTile = (source: RgbaImage, box: TileBox): RgbaImage => {
  const { x, y, width, height } = box;
  const data = new Uint8ClampedArray(width * height * RGBA_CHANNELS);
  for (let row = 0; row < height; row += 1) {
    const from = ((y + row) * source.width + x) * RGBA_CHANNELS;
    data.set(source.data.subarray(from, from + width * RGBA_CHANNELS), row * width * RGBA_CHANNELS);
  }
  return { data, width, height };
};

export { cropTile };
