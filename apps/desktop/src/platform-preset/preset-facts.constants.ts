/* @layer renderer-app @kind constants */
import type { PresetKind } from '@bxel/presets';

const KIND_LABELS: Readonly<Record<PresetKind, string>> = {
  sprite: 'Sprites',
  tile: 'Tiles and backgrounds',
  bitmap: 'Bitmap pictures',
  any: 'Sprites and tiles',
};

const FACT_TEXT = {
  kind: 'Made for',
  family: 'Family',
  colours: 'Colours',
  palettes: 'Palettes',
  slot0: 'Slot 0',
  tile: 'Tile size',
  sprites: 'Sprite sizes',
  canvas: 'New sprite size',
  areas: 'Area rules',
  noTile: 'No tile grid',
  anySize: 'Any size',
  paletteLine: (count: number, size: number): string => `${count} ${count === 1 ? 'palette' : 'palettes'} of ${size} ${size === 1 ? 'slot' : 'slots'}`,
  channelColours: (total: number, bits: string): string => `${total.toLocaleString('en-US')} colours (${bits} bits per channel)`,
  fixedColours: (count: number): string => `${count} fixed colours`,
  subsetColours: (subset: number, total: number): string => `${subset} picked from ${total.toLocaleString('en-US')}`,
  pair: (width: number, height: number): string => `${width} by ${height}`,
  steps: (stepW: number, stepH: number, maxW: number, maxH: number): string => `Multiples of ${stepW} by ${stepH}, up to ${maxW} by ${maxH}`,
  groups: (groups: string): string => `One group per sprite mode: ${groups}`,
  area: (width: number, height: number, rule: string, tier: string): string => `${width} by ${height} area: ${rule} (${tier})`,
  areaRules: { onePalettePerArea: 'one palette per area', maxColoursPerArea: 'a limit of colours per area' },
  tiers: { warn: 'warning', advisory: 'note' },
  limitedAreas: (limit: number): string => `at most ${limit} colours`,
} as const;

const PREVIEW_TEXT = {
  paletteTitle: 'Palette',
  samplesTitle: 'Sample sprite at the sizes of the preset',
  paletteLabel: (count: number): string => `Palette of ${count} colours`,
  freePalette: 'This preset has no fixed palette. You pick any colour of its colour model.',
  sampleLabel: (width: number, height: number): string => `Sample sprite, ${width} by ${height} pixels`,
  notesTitle: 'Notes',
  advisoryTitle: 'Not checked',
} as const;

const PREVIEW_MAX_SIZES = 6;

const PREVIEW_STEP_LIMIT = 64;

const SAMPLE_RINGS = 5;

const SAMPLE_FALLBACK: readonly string[] = ['#2b2b45', '#6a4c93', '#e0475b', '#f2c14e'];

export { FACT_TEXT, KIND_LABELS, PREVIEW_MAX_SIZES, PREVIEW_STEP_LIMIT, PREVIEW_TEXT, SAMPLE_FALLBACK, SAMPLE_RINGS };
