/* @layer renderer-app @kind logic */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { encodePngRgba } from '@bxel/formats';
import { TILED_E2E, TILED_MAP, TILED_TILESET } from './tiled.constants';

const sheetPixels = (): Uint8ClampedArray => {
  const { side, colours } = TILED_E2E;
  const width = 2 * side;
  const data = new Uint8ClampedArray(width * width * 4);
  colours.forEach(([red, green, blue], tile) => {
    const left = (tile % 2) * side;
    const top = Math.floor(tile / 2) * side;
    for (let row = 0; row < side; row += 1) {
      for (let column = 0; column < side; column += 1) data.set([red, green, blue, 255], ((top + row) * width + left + column) * 4);
    }
  });
  return data;
};

const writeTiledFiles = async (folder: string): Promise<string> => {
  await mkdir(join(folder, dirname(TILED_E2E.image)), { recursive: true });
  const width = 2 * TILED_E2E.side;
  const png = encodePngRgba({ data: sheetPixels(), width, height: width });
  if (!png.ok) throw new Error(png.message);
  await writeFile(join(folder, TILED_E2E.image), png.bytes);
  await writeFile(join(folder, TILED_E2E.tileset), TILED_TILESET);
  const map = join(folder, TILED_E2E.map);
  await writeFile(map, TILED_MAP);
  return map;
};

export { writeTiledFiles };
