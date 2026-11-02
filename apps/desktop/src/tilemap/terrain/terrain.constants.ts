/* @layer renderer-app @kind constants */
import { NEIGHBOUR } from '@bxel/document';
import type { TerrainKind } from '@bxel/document';

const TERRAIN_KIND_CHOICES: readonly { kind: TerrainKind; label: string; description: string; glyph: number }[] = [
  { kind: 'blob16', label: 'Edge 16', description: 'Sixteen tiles picked by which of the four sides touch the terrain.', glyph: NEIGHBOUR.N | NEIGHBOUR.E | NEIGHBOUR.S | NEIGHBOUR.W },
  { kind: 'corner16', label: 'Corner 16', description: 'Sixteen tiles picked by which of the four corners are filled.', glyph: NEIGHBOUR.NE | NEIGHBOUR.SE | NEIGHBOUR.SW | NEIGHBOUR.NW },
  { kind: 'blob47', label: 'Blob 47', description: 'Forty seven tiles picked by sides and corners together.', glyph: 255 },
];

const TERRAIN_TEXT = {
  title: 'Terrain',
  noRules: 'The tileset has no terrain rules.',
  brush: 'Terrain brush',
  brushHint: 'Paint and erase pick tiles from the neighbours.',
  start: 'Start a terrain set. Pick the kind that matches your tiles.',
  setPicker: 'Terrain set',
  setName: 'Set name',
  addSet: (label: string): string => `Add ${label} set`,
  deleteSet: 'Delete this set',
  board: 'Terrain template',
  missing: (missing: number, total: number): string => (missing === 0 ? `All ${total} slots filled` : `${missing} of ${total} missing`),
  slot: (index: number, words: string, count: number): string => `Slot ${index + 1}, ${words}, ${count === 0 ? 'empty' : `${count} ${count === 1 ? 'tile' : 'tiles'}`}`,
  detail: 'Slot tiles',
  pickSlot: 'Click a slot to see its tiles and weights.',
  usePicked: 'Use picked tile',
  addPicked: 'Add as variant',
  clearSlot: 'Clear slot',
  noPick: 'Pick a tile in the grid first.',
  weight: (key: number): string => `Weight of tile ${key}`,
  removeVariant: (key: number): string => `Remove tile ${key} from the slot`,
  turned: 'turned',
  fillFromLayout: 'Fill from layout',
  fillHint: 'Reads a block of the grid, starting at the picked tile, in the packing you choose.',
  fillTurning: 'Fill missing by turning',
  fillTurningHint: 'Fills empty slots with flipped or turned copies of tiles whose allowed turns permit it.',
  clearAll: 'Empty all slots',
  marks: 'Marks',
  marksHint: 'Click the zones on a tile to mark which sides or corners it fills.',
  badMask: 'This mix of marks is not a slot of the set.',
  mark: (where: string): string => `Mark ${where}`,
  noSets: 'No terrain set yet.',
} as const;

const GLYPH_ORDER: readonly number[] = [
  NEIGHBOUR.NW, NEIGHBOUR.N, NEIGHBOUR.NE,
  NEIGHBOUR.W, 0, NEIGHBOUR.E,
  NEIGHBOUR.SW, NEIGHBOUR.S, NEIGHBOUR.SE,
];

const BIT_WORDS: readonly (readonly [number, string])[] = [
  [NEIGHBOUR.N, 'north'],
  [NEIGHBOUR.NE, 'north east'],
  [NEIGHBOUR.E, 'east'],
  [NEIGHBOUR.SE, 'south east'],
  [NEIGHBOUR.S, 'south'],
  [NEIGHBOUR.SW, 'south west'],
  [NEIGHBOUR.W, 'west'],
  [NEIGHBOUR.NW, 'north west'],
];

const KIND_BITS: Readonly<Record<TerrainKind, number>> = {
  blob16: NEIGHBOUR.N | NEIGHBOUR.E | NEIGHBOUR.S | NEIGHBOUR.W,
  corner16: NEIGHBOUR.NE | NEIGHBOUR.SE | NEIGHBOUR.SW | NEIGHBOUR.NW,
  blob47: 255,
};

const PACKING_ORIGIN: Readonly<Record<string, string>> = {
  'blob47-7': 'Bxel',
  'blob47-6': 'cr31',
  'blob47-12': 'Template strip',
  'blob16-4': 'Square',
  'blob16-8': 'Strip',
  'corner16-4': 'Square',
  'corner16-8': 'Strip',
};

export { BIT_WORDS, GLYPH_ORDER, KIND_BITS, PACKING_ORIGIN, TERRAIN_KIND_CHOICES, TERRAIN_TEXT };
