/* @layer renderer-app @kind constants */
const FRAME_KEY_DECODER = new TextDecoder('latin1');

const RGBA_BYTES = 4;

const TILE_ANIMATION_TEXT = {
  skipped: (tile: number, reason: string): string => `Tile ${tile} is exported as a still: ${reason}`,
  randomStart: 'Tiled has no random start. Tiles with a random start play together in Tiled. The Bxel map JSON keeps the start.',
  extraTiles: (count: number): string =>
    `${count} animation ${count === 1 ? 'frame is' : 'frames are'} added to the tileset image after the normal tiles. The ids of the normal tiles do not change.`,
} as const;

export { FRAME_KEY_DECODER, RGBA_BYTES, TILE_ANIMATION_TEXT };
