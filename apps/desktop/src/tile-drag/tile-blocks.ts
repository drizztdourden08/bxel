/* @layer renderer-app @kind logic */
import type { TileBlock } from './tile-drag.type';

const blockAt = (pixels: Uint8Array, stride: number, x: number, y: number, width: number, height: number): TileBlock => {
  const out = new Uint8Array(width * height);
  for (let row = 0; row < height; row += 1) {
    const from = (y + row) * stride + x;
    out.set(pixels.subarray(from, from + width), row * width);
  }
  return { width, height, pixels: out };
};

const hasInk = (block: TileBlock): boolean => block.pixels.some((value) => value !== 0);

const tileBlocks = (pixels: Uint8Array, width: number, height: number, tileWidth: number, tileHeight: number): TileBlock[] => {
  const blocks: TileBlock[] = [];
  for (let y = 0; y + tileHeight <= height; y += tileHeight) {
    for (let x = 0; x + tileWidth <= width; x += tileWidth) blocks.push(blockAt(pixels, width, x, y, tileWidth, tileHeight));
  }
  return blocks.filter(hasInk);
};

export { tileBlocks };
