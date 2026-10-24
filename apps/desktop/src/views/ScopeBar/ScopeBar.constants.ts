/* @layer renderer-app @kind constants */
import type { HintSpec } from '../ActionHint';

const SCOPE_TEXT = {
  region: 'Edit scope',
  lockedIcon: 'Locked',
  sprite: (name: string): string => `Sprite: ${name}`,
  layer: (name: string, state: string): string => (state === '' ? `Layer: ${name}` : `Layer: ${name} (${state})`),
  frame: (at: number, total: number): string => `Frame: ${at} of ${total}`,
  painting: (count: number): string => `Painting ${count} sprites`,
} as const;

const MAP_TEXT = {
  placing: 'Placing tiles: the pixels of a tile stay as they are',
  editing: (key: number, uses: number): string =>
    `Editing tile ${key}: ${uses} ${uses === 1 ? 'placement changes' : 'placements change'} with it`,
  editingNone: 'Pick a tile to edit',
  map: (name: string): string => `Map: ${name}`,
  layer: (name: string, state: string): string => (state === '' ? `Layer: ${name}` : `Layer: ${name} (${state})`),
  locked: 'locked',
  hidden: 'hidden',
  turn: 'Turn',
  noTurn: 'None',
  selected: (columns: number, rows: number): string => `${columns} x ${rows} cells selected`,
  noSelection: 'Drag to select cells',
} as const;

const SCOPE_DESCRIPTION = 'The part of the file your edits change.';

const SCOPE_HINTS = {
  sprites: { name: 'Sprites', description: 'Choose which sprites your edits change.' },
  layers: { name: 'Layers', description: 'Choose which layers your edits change.' },
  frames: { name: 'Frames', description: 'Choose which frames your edits change.' },
} as const satisfies Record<string, HintSpec>;

export { MAP_TEXT, SCOPE_DESCRIPTION, SCOPE_HINTS, SCOPE_TEXT };
