/* @layer renderer-app @kind constants */
import type { RulerUnit, UnitScale } from './ruler-unit.type';

const RULER_UNITS: readonly RulerUnit[] = ['pixels', 'tiles', 'percent'];

const RULER_UNIT_LABELS: Readonly<Record<RulerUnit, string>> = {
  pixels: 'Pixels',
  tiles: 'Tiles',
  percent: 'Percent',
};

const RULER_UNIT_TEXT = {
  menu: 'Units',
  noTile: 'Set a tile grid size on the Grid and rulers page first.',
  setting: 'Ruler units',
  settingDescription: 'What the numbers on the rulers count.',
  settingHint: 'Pixels count from the corner of the image. Tiles count in tiles of the tile grid size. Percent counts the width or the height of the image as 100.',
} as const;

const PIXEL_SCALE = { size: 1, suffix: '' } as const;

const UNIT_SCALES: Readonly<Record<RulerUnit, (count: number, tile: number) => UnitScale>> = {
  pixels: (count) => ({ ...PIXEL_SCALE, total: count }),
  tiles: (count, tile) => ({ size: tile, total: count / tile, suffix: '' }),
  percent: (count) => ({ size: Math.max(1, count) / 100, total: 100, suffix: '%' }),
};

export { PIXEL_SCALE, RULER_UNIT_LABELS, RULER_UNIT_TEXT, RULER_UNITS, UNIT_SCALES };
