/* @layer renderer-app @kind constants */
import type { SpriteId } from '@bxel/document';
import type { VirtualSize } from '@drizztdourden08/tessera';
import { DIALOG_COMMAND } from '../../keymap/dialog-command-id.constants';
import { SHEET_COMMAND } from '../../keymap/sheet-command-id.constants';
import { MANAGER_TEXT } from '../../sheet-manager/manager-text.constants';
import type { HintSpec } from '../ActionHint';
import type { ListColumn } from './SpritesPanel.type';

const NO_SPRITES: readonly SpriteId[] = [];

const DRAG_TYPE = 'application/x-bxel-sprite';

const ANY_SIZE = 'any';

const ARROW_STEP: Readonly<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1 };

const LIST_THUMB = 32;

const TILE_SIZES: readonly { readonly token: VirtualSize; readonly px: number }[] = [
  { token: 'size-48', px: 48 },
  { token: 'size-56', px: 56 },
  { token: 'size-64', px: 64 },
  { token: 'size-80', px: 80 },
  { token: 'size-96', px: 96 },
  { token: 'size-128', px: 128 },
  { token: 'size-160', px: 160 },
  { token: 'size-192', px: 192 },
  { token: 'size-224', px: 224 },
  { token: 'size-256', px: 256 },
];

const TILE_EXTRA = { width: 24, height: 48 } as const;

const GRID_CELL = '[role="gridcell"]';

const VIRTUAL_LIST_MIN = 200;

const END_INDEX = 100000;

const FOLDER_DEPTH_LIMIT = 4;

const MANAGER_TABS = [
  { id: 'sprites', label: MANAGER_TEXT.tabs.sprites },
  { id: 'atlas', label: MANAGER_TEXT.tabs.atlas },
];

const LIST_COLUMNS: readonly ListColumn[] = [
  { key: 'name', label: 'name' },
  { key: 'size', label: 'size' },
  { key: null, label: 'pivot' },
  { key: 'frames', label: 'frames' },
  { key: 'tags', label: 'tags' },
  { key: 'bank', label: 'bank' },
];

const IN_LIST = 'In the list';

const SPRITE_HINTS = {
  add: {
    name: MANAGER_TEXT.add,
    description: 'Add a new sprite to this file.',
    shortcuts: [{ command: DIALOG_COMMAND.newSprite }],
  },
  duplicate: {
    name: MANAGER_TEXT.duplicate,
    description: 'Make a copy of the selected sprites.',
    shortcuts: [{ command: SHEET_COMMAND.duplicateSprite }],
  },
  isolate: {
    name: MANAGER_TEXT.isolate,
    description: 'Open the selected sprite on its own to edit it.',
    shortcuts: [{ command: SHEET_COMMAND.isolate }, { keys: ['enter'], label: IN_LIST }],
  },
  earlier: {
    name: MANAGER_TEXT.earlier,
    description: 'Move the selected sprites one place earlier in the order.',
    shortcuts: [{ command: SHEET_COMMAND.moveEarlier }, { keys: ['alt', 'left'], label: IN_LIST }],
  },
  later: {
    name: MANAGER_TEXT.later,
    description: 'Move the selected sprites one place later in the order.',
    shortcuts: [{ command: SHEET_COMMAND.moveLater }, { keys: ['alt', 'right'], label: IN_LIST }],
  },
  remove: {
    name: MANAGER_TEXT.remove,
    description: 'Delete the selected sprites. You are asked to confirm first.',
    shortcuts: [{ command: SHEET_COMMAND.deleteSprite }, { keys: ['delete'], label: IN_LIST }],
  },
  more: {
    name: MANAGER_TEXT.moreActions,
    description: 'Rename, order, transform and select sprites, and use the sheet.',
  },
  grid: {
    name: MANAGER_TEXT.grid,
    description: 'Show the sprites as thumbnails.',
  },
  list: {
    name: MANAGER_TEXT.list,
    description: 'Show the sprites as a table with their size, pivot and frames.',
  },
  selectMatches: {
    name: MANAGER_TEXT.selectMatches,
    description: 'Select every sprite that matches the search and the filters.',
    shortcuts: [{ keys: ['enter'], label: 'In the search box' }],
  },
} as const satisfies Record<string, HintSpec>;

const SPRITE_STEPS = [
  { hint: SPRITE_HINTS.earlier, icon: 'arrow-left', by: -1 },
  { hint: SPRITE_HINTS.later, icon: 'arrow-right', by: 1 },
] as const;

export { ANY_SIZE, ARROW_STEP, DRAG_TYPE, END_INDEX, FOLDER_DEPTH_LIMIT, GRID_CELL, LIST_COLUMNS, LIST_THUMB, MANAGER_TABS, NO_SPRITES, SPRITE_HINTS, SPRITE_STEPS, TILE_EXTRA, TILE_SIZES, VIRTUAL_LIST_MIN };
