/* @layer renderer-app @kind constants */
import { DEFAULT_FRAME_DURATION_MS, MAX_BANK_CAP, MAX_DURATION_MS, MAX_SPRITE_SIZE, MIN_BANK_CAP, MIN_DURATION_MS, MIN_SPRITE_SIZE } from '@bxel/document';
import type { AssetDefaults } from '@bxel/project';
import { LIMIT_DEFAULT } from '../palette-limit/palette-limit.constants';
import { PRESET_DEFAULT } from '../palette-source/palette-source.constants';

const APP_ASSET_DEFAULTS: AssetDefaults = {
  size: { width: 16, height: 16 },
  colorLimit: LIMIT_DEFAULT,
  palette: { kind: 'preset', presetId: PRESET_DEFAULT },
  platformId: null,
  platformStrict: false,
  transparent: true,
  frameDurationMs: DEFAULT_FRAME_DURATION_MS,
  pixelGrid: { width: 1, height: 1 },
};

const GRID_LABELS = { width: 'Cell across', height: 'Cell down' } as const;

const CHOICE_MARK = { preset: 'preset', file: 'file' } as const;

const CHOICE_SEPARATOR = '|';

const DEFAULT_RANGES = {
  size: { min: MIN_SPRITE_SIZE, max: MAX_SPRITE_SIZE },
  colorLimit: { min: MIN_BANK_CAP, max: MAX_BANK_CAP },
  frameDurationMs: { min: MIN_DURATION_MS, max: MAX_DURATION_MS },
} as const;

const DEFAULTS_TEXT = {
  inheritValue: (value: string): string => `Uses the app default: ${value}`,
  reset: 'Use the app default',
  none: 'No platform',
  width: 'Width',
  height: 'Height',
  size: (width: number, height: number): string => `${width} by ${height} pixels`,
  colours: (limit: number): string => `${limit} colours`,
  on: 'On',
  off: 'Off',
  frame: (ms: number): string => `${ms} ms`,
  paletteFile: (name: string): string => `Palette file ${name}`,
  palettePreset: (name: string): string => `Palette ${name}`,
  presetGroup: 'Palettes that ship with Bxel',
  fileGroup: 'Palette files of the project',
} as const;

export { APP_ASSET_DEFAULTS, CHOICE_MARK, GRID_LABELS, CHOICE_SEPARATOR, DEFAULT_RANGES, DEFAULTS_TEXT };
