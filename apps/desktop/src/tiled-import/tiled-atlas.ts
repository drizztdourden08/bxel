/* @layer renderer-app @kind logic */
import type { TiledPlan } from '@bxel/formats';
import { RGBA_BYTES } from '../image-import/image-import.constants';
import type { SourceImage } from '../image-import/image-import.type';
import { atlasColumns } from './atlas-columns';
import { atlasOrigin } from './atlas-origin';

const tiledAtlas = (plan: TiledPlan, fileName: string): SourceImage => {
  const columns = atlasColumns(plan.tiles.length);
  const rows = Math.ceil(plan.tiles.length / columns);
  const width = columns * plan.tileWidth;
  const data = new Uint8ClampedArray(width * rows * plan.tileHeight * RGBA_BYTES);
  plan.tiles.forEach((tile, index) => {
    const origin = atlasOrigin(index, columns, plan);
    for (let row = 0; row < plan.tileHeight; row += 1) {
      const from = row * plan.tileWidth * RGBA_BYTES;
      data.set(tile.image.data.subarray(from, from + plan.tileWidth * RGBA_BYTES), ((origin.y + row) * width + origin.x) * RGBA_BYTES);
    }
  });
  return { fileName, width, height: rows * plan.tileHeight, data };
};

export { tiledAtlas };
