/* @layer renderer-app @kind constants */
import { NEIGHBOUR } from '@bxel/document';

const TERRAIN_CHOICES = [
  { value: 'none', label: 'None' },
  { value: 'blob16', label: '16 tiles' },
  { value: 'blob47', label: '47 tiles' },
] as const;

const TERRAIN_TEXT = {
  title: 'Terrain',
  kind: 'Terrain rule set',
  brush: 'Terrain brush',
  brushHint: 'Paint and erase pick tiles from the neighbours.',
  slots: 'Terrain slots',
  slot: (index: number, key: number): string => (key === 0 ? `Terrain slot ${index + 1}, empty` : `Terrain slot ${index + 1}, tile ${key}`),
  help: 'Pick a tile, then click a slot to give it that tile. Click the same tile again to empty the slot.',
  fill: 'Fill slots from the picked tile',
  clear: 'Empty all slots',
  noPick: 'Pick a tile first.',
  none: 'No terrain rules. Choose a rule set to paint with neighbours.',
} as const;

const GLYPH_ORDER: readonly number[] = [
  NEIGHBOUR.NW, NEIGHBOUR.N, NEIGHBOUR.NE,
  NEIGHBOUR.W, 0, NEIGHBOUR.E,
  NEIGHBOUR.SW, NEIGHBOUR.S, NEIGHBOUR.SE,
];

export { GLYPH_ORDER, TERRAIN_CHOICES, TERRAIN_TEXT };
