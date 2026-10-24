/* @layer renderer-app @kind logic */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { encodePngRgba } from '@bxel/formats';
import { BLOCKS, BLOCKS_FILE } from './blocks.constants';

const writeBlocksPng = async (dir: string): Promise<string> => {
  const data = new Uint8ClampedArray(BLOCKS.width * BLOCKS.height * 4);
  for (let at = 0; at < BLOCKS.width * BLOCKS.height; at += 1) {
    const block = Math.floor((at % BLOCKS.width) / BLOCKS.side) + BLOCKS.columns * Math.floor(Math.floor(at / BLOCKS.width) / BLOCKS.side);
    data.set([block * 12 + 7, 255 - block * 11, (block * 37) % 256, 255], at * 4);
  }
  const png = encodePngRgba({ width: BLOCKS.width, height: BLOCKS.height, data });
  if (!png.ok) throw new Error(png.message);
  const path = join(dir, BLOCKS_FILE);
  await writeFile(path, png.bytes);
  return path;
};

export { writeBlocksPng };
