/* @layer renderer-app @kind constants */
import type { AssetView, BackgroundKind } from './asset-view.type';

const ASSET_VIEW_DEFAULTS: AssetView = { tileGrid: null, majorEvery: null, background: 'checker', backgroundColour: '#3a8fb7' };

const GRID_SIZE_RANGE = { min: 1, max: 512 } as const;

const MAJOR_RANGE = { min: 2, max: 256 } as const;

const BACKGROUND_KINDS: readonly BackgroundKind[] = ['checker', 'solid'];

const ASSET_VIEW_TEXT = {
  checker: 'Checker',
  solid: 'Game colour',
  custom: 'Set for this asset',
  source: {
    tileset: 'From the tileset tile size',
    map: 'From the map cell',
    sheet: 'From the sheet cell',
    setting: 'From the Canvas setting',
  },
} as const;

export { ASSET_VIEW_DEFAULTS, ASSET_VIEW_TEXT, BACKGROUND_KINDS, GRID_SIZE_RANGE, MAJOR_RANGE };
