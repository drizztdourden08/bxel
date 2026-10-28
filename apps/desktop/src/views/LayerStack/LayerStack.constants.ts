/* @layer renderer-app @kind constants */
import type { IconName } from '@drizztdourden08/tessera';
import type { LayerFlag } from '../../editor/layer-flag.type';
import type { LockKind } from '../../editor/layer-lock.type';
import { COMMAND_ID } from '../../keymap/keymap.constants';
import type { LayerThumbSize } from '../../stores/layer-view-store.type';
import type { HintSpec } from '../ActionHint';

const LAYER_STACK_TEXT = {
  list: 'Layers',
  mapList: 'Map layers',
  sheetList: 'Layer names',
  noSprite: 'No sprite is open.',
  noFrames: 'This animation has no frames yet.',
  noTile: 'Pick a tile to edit its layers.',
  noMap: 'This file has no tilemap yet.',
  noMatch: 'No layer matches.',
  clearFilter: 'Clear filter',
  count: (total: number): string => (total === 1 ? '1 layer' : `${total} layers`),
  shown: (shown: number, total: number): string => `${shown} of ${total} layers`,
  owner: 'Layers of',
  sprite: (name: string): string => `Sprite ${name}`,
  tile: (name: string): string => `Tile ${name}`,
  frame: (index: number, animation: string, sprite: string): string => `Frame ${index} of ${animation} (${sprite})`,
  map: (name: string, columns: number, rows: number): string => `Map ${name} (${columns} x ${rows})`,
  sheetAll: (count: number): string => `All ${count} sprites`,
  sheetPicked: (count: number): string => `${count} picked sprites`,
  tilemap: 'Tilemap',
  view: 'Layer list view',
  thumbSize: 'Thumbnail size',
  thumbOff: 'No thumbnails',
  thumbPx: (size: number): string => `${size} px`,
  filter: 'Filter layers',
  filterPlaceholder: 'Filter by name',
  filterColour: 'Filter by colour',
  lockKinds: 'Lock kind',
  scope: 'Edit scope',
  tagColours: 'Colour tag',
  noTag: 'No colour',
  tagName: (name: string): string => `Colour ${name}`,
  inSprites: (have: number, total: number): string => `in ${have} of ${total} sprites`,
  moved: (name: string, position: number, total: number): string => `${name} moved to position ${position} of ${total}`,
  moveHint: 'Alt and Up or Down moves the row. Shift and Up or Down extends the pick.',
  soloOn: (name: string): string => `Showing only ${name}`,
  renameLabel: (name: string): string => `Rename ${name}`,
  oneLayer: 'A list with one layer has nothing else to show or hide.',
  top: 'This is the top layer.',
  bottom: 'This is the bottom layer.',
  mixed: 'Mixed',
  grip: 'Drag to reorder',
  picked: (count: number): string => `Settings for ${count} picked layers`,
  stripOf: (name: string): string => `Settings for ${name}`,
  newLayer: 'New layer',
  more: 'More ways to add a layer',
} as const;

const LAYER_MENU_TEXT = {
  row: '[data-layer-id]',
  label: 'Layer actions',
  visible: 'Visible',
  locked: 'Locked',
  rename: 'Rename',
  colour: 'Colour tag',
  mergeDown: 'Merge down',
  mergeMapDown: 'Merge map layer down (top wins)',
} as const;

const LAYER_SCOPES = [
  { value: 'frame', label: 'This frame', title: 'Changes reach the layer of the frame you are editing.' },
  { value: 'all', label: 'All frames', title: 'Changes reach the layer of the same name in every frame of the animation.' },
] as const;

const LAYER_FLAG_ICONS: Readonly<Record<LayerFlag, { on: IconName; off: IconName }>> = {
  visible: { on: 'eye', off: 'eye-off' },
  locked: { on: 'lock', off: 'lock-open' },
};

const LAYER_LOCK_ICONS: Readonly<Record<LockKind, IconName>> = {
  none: 'lock-open',
  transparency: 'layout-grid',
  pixels: 'lock',
};

const LAYER_LOCK_TEXT: Readonly<Record<LockKind, { name: string; description: string }>> = {
  none: { name: 'Unlocked', description: 'Pixels on this layer can be changed.' },
  transparency: { name: 'Lock transparency', description: 'Paint only on pixels that are already painted. Empty pixels stay empty.' },
  pixels: { name: 'Lock pixels', description: 'Nothing on this layer can be changed until you unlock it.' },
};

const LAYER_FLAG_HINTS: Readonly<Record<LayerFlag, HintSpec>> = {
  visible: {
    name: 'Visible',
    description: 'Show or hide this layer. A hidden layer cannot be drawn on. Drag down the column to set many. Alt and click shows only this one. Shift and click hides the others.',
  },
  locked: {
    name: 'Locked',
    description: 'Lock this layer so nothing can be drawn on it by mistake. Drag down the column to set many. Alt and click locks the others.',
  },
};

const LAYER_SWEEP_LABEL: Readonly<Record<LayerFlag, string>> = { visible: 'Show or hide layers', locked: 'Lock or unlock layers' };

const LAYER_FOCUS_KEYS: Readonly<Record<string, 'first' | 'last'>> = { Home: 'first', End: 'last' };

const LAYER_MOVE_KEYS = 'Alt+ArrowUp Alt+ArrowDown Shift+ArrowUp Shift+ArrowDown';

const LAYER_THUMB_TEXT: Readonly<Record<LayerThumbSize, string>> = {
  0: LAYER_STACK_TEXT.thumbOff,
  16: LAYER_STACK_TEXT.thumbPx(16),
  24: LAYER_STACK_TEXT.thumbPx(24),
  40: LAYER_STACK_TEXT.thumbPx(40),
};

const FILTER_FROM_ROWS = 8;

const THUMB_THROTTLE_MS = 80;

const LAYER_BAR_HINTS = {
  add: { name: 'New layer', description: 'Add an empty layer above the current one.', shortcuts: [{ command: COMMAND_ID.layerAdd }] },
  more: { name: 'More ways to add a layer', description: 'Add a layer that joins all visible layers.' },
  duplicate: { name: 'Duplicate layer', description: 'Make a copy of the current layer.', shortcuts: [{ command: COMMAND_ID.layerDuplicate }] },
  merge: { name: 'Merge down', description: 'Join the current layer into the layer below it.', shortcuts: [{ command: COMMAND_ID.layerMerge }] },
  remove: {
    name: 'Delete layer',
    description: 'Remove the picked layers. A list keeps at least one layer.',
    shortcuts: [{ command: COMMAND_ID.layerDelete }, { keys: ['delete'], label: 'In the list' }],
  },
} satisfies Record<string, HintSpec>;

export {
  FILTER_FROM_ROWS, LAYER_BAR_HINTS, LAYER_FLAG_HINTS, LAYER_FLAG_ICONS, LAYER_FOCUS_KEYS, LAYER_LOCK_ICONS, LAYER_LOCK_TEXT, LAYER_MENU_TEXT, LAYER_MOVE_KEYS, LAYER_SCOPES,
  LAYER_STACK_TEXT, LAYER_SWEEP_LABEL, LAYER_THUMB_TEXT, THUMB_THROTTLE_MS,
};
