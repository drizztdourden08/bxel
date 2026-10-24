/* @layer core @kind constants */
import type { Rec } from './rec.type';
import type { TiledShape } from './tiled.type';

const TILED_LIMITS = {
  MAX_SIDE: 4096,
  MAX_CELLS: 4194304,
  MAX_LAYER_DEPTH: 8,
  MAX_LAYERS: 256,
  MAX_TILES: 65536,
  MAX_POINTS: 64,
  MAX_PLAN_TILES: 4096,
} as const;

const TILED_FLAG = {
  FLIP_X: 0x80000000,
  FLIP_Y: 0x40000000,
  DIAGONAL: 0x20000000,
  HEX_ROTATE: 0x10000000,
  ALL: 0xf0000000,
  KEY_MASK: 0x0fffffff,
} as const;

const TILED_ORIENTATIONS = ['orthogonal', 'isometric', 'staggered', 'hexagonal'] as const;

const KEPT_FLAGS = TILED_FLAG.FLIP_X | TILED_FLAG.FLIP_Y | TILED_FLAG.DIAGONAL;

const RGBA_CHANNELS = 4;

const COLOUR_PATTERN = /^#?([0-9a-fA-F]{6})$/;

const BYTE_BITS = 8;

const BYTE_MASK = 0xff;

const BYTES_PER_GID = 4;

const EMPTY_REC: Rec = {};

const EMPTY_SHAPES: readonly TiledShape[] = [];

const XML_LAYER_TYPE: Readonly<Record<string, string>> = {
  layer: 'tilelayer',
  group: 'group',
  objectgroup: 'objectgroup',
  imagelayer: 'imagelayer',
};

const BYTE_ORDER_MARK = 0xfeff;

export {
  BYTE_BITS,
  BYTE_MASK,
  BYTE_ORDER_MARK,
  BYTES_PER_GID,
  COLOUR_PATTERN,
  EMPTY_REC,
  EMPTY_SHAPES,
  KEPT_FLAGS,
  RGBA_CHANNELS,
  TILED_FLAG,
  TILED_LIMITS,
  TILED_ORIENTATIONS,
  XML_LAYER_TYPE,
};
