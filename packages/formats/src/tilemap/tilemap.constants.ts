/* @layer core @kind constants */

const TILEMAP_JSON = {
  FORMAT: 'bxel-tilemap',
  VERSION: 1,
  FLAG_BITS: { flipX: 1, flipY: 2, diagonal: 4 },
} as const;

const TILED_JSON = {
  VERSION: '1.10',
  TILED_VERSION: '1.10.2',
  FIRST_GID: 1,
} as const;

const CELL_BITS = {
  KEY_MASK: 0x0fffffff,
  RESERVED: 0x10000000,
  FLIP_X: 0x80000000,
  FLIP_Y: 0x40000000,
  DIAGONAL: 0x20000000,
  FLAG_MASK: 0xe0000000,
} as const;

export { CELL_BITS, TILED_JSON, TILEMAP_JSON };
