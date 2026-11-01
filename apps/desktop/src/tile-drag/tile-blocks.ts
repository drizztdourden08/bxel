/* @layer renderer-app @kind logic */
import type { BlockSize, TileBlock } from './tile-drag.type';

const blockAt = (pixels: Uint8Array, stride: number, origin: { x: number; y: number }, size: BlockSize): TileBlock => {
  const out = new Uint8Array(size.width * size.height);
  for (let row = 0; row < size.height; row += 1) {
    const from = (origin.y + row) * stride + origin.x;
    out.set(pixels.subarray(from, from + size.width), row * size.width);
  }
  return { width: size.width, height: size.height, pixels: out };
};

const hasInk = (block: TileBlock): boolean => block.pixels.some((value) => value !== 0);

const tileBlocks = (pixels: Uint8Array, image: BlockSize, tile: BlockSize): TileBlock[] => {
  const blocks: TileBlock[] = [];
  for (let y = 0; y + tile.height <= image.height; y += tile.height) {
    for (let x = 0; x + tile.width <= image.width; x += tile.width) blocks.push(blockAt(pixels, image.width, { x, y }, tile));
  }
  return blocks.filter(hasInk);
};

export { tileBlocks };
