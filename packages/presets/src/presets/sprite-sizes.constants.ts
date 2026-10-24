/* @layer core @kind constants */
import type { SpriteSizeRule } from '../model/preset.type';

const SIZES_ANY: SpriteSizeRule = { kind: 'any' };

const SIZES_TILE_STEPS: SpriteSizeRule = {
  kind: 'steps',
  stepW: 8,
  stepH: 8,
  maxW: 1024,
  maxH: 1024,
};

const SIZES_8_OR_8X16: SpriteSizeRule = {
  kind: 'groups',
  groups: [[[8, 8]], [[8, 16]]],
};

const SIZES_GBA: SpriteSizeRule = {
  kind: 'list',
  sizes: [
    [8, 8], [16, 16], [32, 32], [64, 64], [16, 8], [32, 8],
    [32, 16], [64, 32], [8, 16], [8, 32], [16, 32], [32, 64],
  ],
};

const SIZES_SNES: SpriteSizeRule = {
  kind: 'groups',
  groups: [
    [[8, 8], [16, 16]],
    [[8, 8], [32, 32]],
    [[8, 8], [64, 64]],
    [[16, 16], [32, 32]],
    [[16, 16], [64, 64]],
    [[32, 32], [64, 64]],
  ],
};

const SIZES_GENESIS: SpriteSizeRule = {
  kind: 'steps',
  stepW: 8,
  stepH: 8,
  maxW: 32,
  maxH: 32,
};

const SIZES_PICO_8: SpriteSizeRule = {
  kind: 'steps',
  stepW: 8,
  stepH: 8,
  maxW: 128,
  maxH: 128,
};

const SIZES_TIC_80: SpriteSizeRule = {
  kind: 'steps',
  stepW: 8,
  stepH: 8,
  maxW: 64,
  maxH: 64,
};

export {
  SIZES_8_OR_8X16,
  SIZES_ANY,
  SIZES_GBA,
  SIZES_GENESIS,
  SIZES_PICO_8,
  SIZES_SNES,
  SIZES_TIC_80,
  SIZES_TILE_STEPS,
};
