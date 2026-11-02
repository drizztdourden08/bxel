/* @layer renderer-app @kind constants */
import type { IconName } from '@drizztdourden08/tessera';
import type { LayerFlag } from '../../editor/layer-flag.type';
import type { LockKind } from '../../editor/layer-lock.type';
import { COMMAND_ID } from '../../keymap/keymap.constants';
import type { LayerThumbSize } from '../../stores/layer-view-store.type';
import type { HintSpec } from '../ActionHint';
import type { LayerRowTree, MapChoice } from './LayerStack.type';

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
  mapName: (name: string): string => `Map ${name}`,
  mapSize: (columns: number, rows: number): string => `${columns} x ${rows}`,
  sheetAll: (count: number): string => (count === 1 ? 'The only sprite' : `All ${count} sprites`),
  sheetPicked: (count: number): string => (count === 1 ? '1 picked sprite' : `${count} picked sprites`),
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
  inSprites: (have: number, total: number): string => `in ${have} of ${total} ${total === 1 ? 'sprite' : 'sprites'}`,
  groupOf: (name: string, count: number): string => `${name}, group of ${count}`,
  referenceOf: (name: string): string => `${name}, reference image`,
  opacity: 'Opacity',
  opacityValue: (percent: number): string => `${percent} percent`,
  clipLabel: 'Clip',
  clipHint: 'Draw this layer only where the pixel layer below it has pixels.',
  exportLabel: 'Export',
  exportHint: 'Leave this layer out of every export when off. A reference image is never exported.',
  missingBadge: 'Missing',
  relink: 'Relink image',
  clippedBadge: 'Clip',
  hiddenFromExport: 'Not exported',
  fadedBadge: (percent: number): string => `${percent}%`,
  soloOn: (name: string): string => `Showing only ${name}`,
  renameLabel: (name: string): string => `Rename ${name}`,
  oneLayer: 'A list with one layer has nothing else to show or hide.',
  top: 'This is the top layer.',
  bottom: 'This is the bottom layer.',
  mixed: 'Mixed',
  picked: (count: number): string => `Settings for ${count} picked layers`,
  stripOf: (name: string): string => `Settings for ${name}`,
  newLayer: 'New layer',
  newShort: 'New',
  more: 'More ways to add a layer',
  addMissing: 'Add missing layers',
  addMissingHint: 'Add this layer to every sprite in the list that does not have it yet.',
} as const;

const LAYER_MENU_TEXT = {
  row: '[data-tree-key]',
  label: 'Layer actions',
  visible: 'Visible',
  locked: 'Locked',
  rename: 'Rename',
  colour: 'Colour tag',
  mergeDown: 'Merge down',
  mergeMapDown: 'Merge map layer down (top wins)',
  group: 'Group',
  ungroup: 'Ungroup',
  flattenGroup: 'Flatten group',
  moveOut: 'Move out of group',
  selectChildren: 'Select children',
  mergeSelected: 'Merge picked layers',
  toLayer: 'Selection to new layer',
  cutToLayer: 'Cut selection to new layer',
  reference: 'Reference image from file',
  relink: 'Relink image',
  highlight: 'Highlight current layer',
  fold: 'Fold or unfold group',
  clip: 'Clip to layer below',
  exported: 'Include in export',
} as const;

const LAYER_SCOPES = [
  { value: 'frame', label: 'This frame', title: 'Changes reach the layer of the frame you are editing.' },
  { value: 'all', label: 'All frames', title: 'Changes reach the layer of the same name in every frame of the animation.' },
] as const;

const LAYER_TILE_SCOPES = [
  { value: 'frame', label: 'This tile', title: 'Changes reach the layer of the tile you are editing.' },
  { value: 'all', label: 'All tiles of this tileset', title: 'Changes reach the layer of the same name in every tile of the tileset.' },
] as const;

const LAYER_FLAG_ICONS: Readonly<Record<LayerFlag, { on: IconName; off: IconName }>> = {
  visible: { on: 'eye', off: 'eye-off' },
  locked: { on: 'lock', off: 'lock-open' },
};

const LAYER_LOCK_ICONS: Readonly<Record<LockKind, IconName>> = {
  none: 'lock-open',
  transparency: 'layout-grid',
  pixels: 'lock',
  position: 'move',
};

const LAYER_LOCK_TEXT: Readonly<Record<LockKind, { name: string; description: string }>> = {
  none: { name: 'Unlocked', description: 'Pixels on this layer can be changed.' },
  transparency: { name: 'Lock transparency', description: 'Paint only on pixels that are already painted. Empty pixels stay empty.' },
  pixels: { name: 'Lock pixels', description: 'Nothing on this layer can be changed until you unlock it.' },
  position: { name: 'Lock position', description: 'Paint as usual, but Move and Transform leave this layer where it is.' },
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

const LAYER_THUMB_TEXT: Readonly<Record<LayerThumbSize, string>> = {
  0: LAYER_STACK_TEXT.thumbOff,
  16: LAYER_STACK_TEXT.thumbPx(16),
  24: LAYER_STACK_TEXT.thumbPx(24),
  40: LAYER_STACK_TEXT.thumbPx(40),
};

const FILTER_FROM_ROWS = 8;

const STRIP_ROOT = '[data-layer-stack]';

const STRIP_TARGET = '[data-layer-strip] button:not([disabled])';

const NO_MAPS: readonly MapChoice[] = [];

const FLAT_ROW: LayerRowTree = { kind: 'pixel', depth: 0, parentId: null, childCount: 0, viewOpacity: 100, clip: false, exported: true, missing: false };

const LAYER_REASONS = {
  last: 'A list keeps at least one layer.',
  bottom: 'There is no layer below to merge into.',
} as const;

const CUSTOM_COLOUR = 'custom colour';

const THUMB_THROTTLE_MS = 80;

const LAYER_BAR_HINTS = {
  add: { name: 'New layer', description: 'Add an empty layer above the current one.', shortcuts: [{ command: COMMAND_ID.layerAdd }] },
  more: { name: 'More ways to add a layer', description: 'Add a layer that joins all visible layers.' },
  duplicate: { name: 'Duplicate layer', description: 'Make a copy of the current layer.', shortcuts: [{ command: COMMAND_ID.layerDuplicate }] },
  merge: { name: 'Merge down', description: 'Join the current layer into the layer below it.', shortcuts: [{ command: COMMAND_ID.layerMerge }] },
  group: { name: 'Group', description: 'Put the picked layers into a new group.', shortcuts: [{ command: COMMAND_ID.layerGroup }] },
  remove: {
    name: 'Delete layer',
    description: 'Remove the picked layers. A list keeps at least one layer.',
    shortcuts: [{ command: COMMAND_ID.layerDelete }, { keys: ['delete'], label: 'In the list' }],
  },
} satisfies Record<string, HintSpec>;

export {
  CUSTOM_COLOUR, FILTER_FROM_ROWS, STRIP_ROOT, STRIP_TARGET, FLAT_ROW, LAYER_REASONS, NO_MAPS, LAYER_BAR_HINTS, LAYER_FLAG_HINTS, LAYER_FLAG_ICONS, LAYER_LOCK_ICONS, LAYER_LOCK_TEXT, LAYER_MENU_TEXT, LAYER_SCOPES,
  LAYER_STACK_TEXT, LAYER_TILE_SCOPES, LAYER_THUMB_TEXT, THUMB_THROTTLE_MS,
};
