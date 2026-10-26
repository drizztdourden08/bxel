/* @layer renderer-app @kind constants */
import type { SpriteId } from '@bxel/document';
import type { FieldDescriptor, TableColumn, VirtualSize } from '@drizztdourden08/tessera';
import { DIALOG_COMMAND } from '../../keymap/dialog-command-id.constants';
import { SHEET_COMMAND } from '../../keymap/sheet-command-id.constants';
import { FOLDER_TEXT } from '../../sheet-manager/folder-text.constants';
import { MANAGER_TEXT } from '../../sheet-manager/manager-text.constants';
import type { HintSpec } from '../ActionHint';
import type { ListRow } from './SpritesPanel.type';

const NO_SPRITES: readonly SpriteId[] = [];

const DRAG_TYPE = 'application/x-bxel-sprite';

const ANY_SIZE = 'any';

const ARROW_STEP: Readonly<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1 };

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

const MARQUEE_ITEM = '[data-marquee-key]';

const MARQUEE_SKIP = 'button, input, [role="columnheader"]';

const GRID_CELL = '[role="gridcell"]';

const VIRTUAL_LIST_MIN = 200;

const END_INDEX = 100000;

const FOLDER_DEPTH_LIMIT = 4;

const MANAGER_TABS = [
  { id: 'sprites', label: MANAGER_TEXT.tabs.sprites },
  { id: 'atlas', label: MANAGER_TEXT.tabs.atlas },
];

const TEXT_ENTRY = 'input:not([type="checkbox"]), textarea, [contenteditable="true"]';

const CHECKBOX = 'input[type="checkbox"]';

const LIST_HEAD_ROOM = 48;

const LIST_LABEL = 'Sprites';

const LIST_VIEW_KEY = 'bxel:sprite-list';

const LIST_COUNT_LABEL = ['sprite', 'sprites'] as const;

const LIST_FIELDS: readonly { readonly path: keyof ListRow; readonly label: string; readonly kind: 'string' | 'number'; readonly width: number }[] = [
  { path: 'name', label: MANAGER_TEXT.columns.name, kind: 'string', width: 192 },
  { path: 'width', label: MANAGER_TEXT.columns.width, kind: 'number', width: 120 },
  { path: 'height', label: MANAGER_TEXT.columns.height, kind: 'number', width: 120 },
  { path: 'pivot', label: MANAGER_TEXT.columns.pivot, kind: 'string', width: 128 },
  { path: 'frames', label: MANAGER_TEXT.columns.frames, kind: 'number', width: 120 },
  { path: 'tags', label: MANAGER_TEXT.columns.tags, kind: 'number', width: 112 },
  { path: 'bank', label: MANAGER_TEXT.columns.bank, kind: 'string', width: 120 },
];

const LIST_FOLDER_FIELD: FieldDescriptor = { path: 'folder', label: FOLDER_TEXT.field, kind: 'string', optional: false, hidden: true };

const LIST_SCHEMA: readonly FieldDescriptor[] = [
  ...LIST_FIELDS.map(({ path, label, kind }): FieldDescriptor => ({ path, label, kind, optional: false })),
  LIST_FOLDER_FIELD,
];

const LIST_COLUMNS: readonly TableColumn[] = LIST_FIELDS.map(({ path, width }) => ({ path, width }));

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

export { ANY_SIZE, ARROW_STEP, CHECKBOX, DRAG_TYPE, END_INDEX, FOLDER_DEPTH_LIMIT, GRID_CELL, LIST_COLUMNS, LIST_COUNT_LABEL, LIST_HEAD_ROOM, LIST_LABEL, LIST_SCHEMA, LIST_VIEW_KEY, MANAGER_TABS, MARQUEE_ITEM, MARQUEE_SKIP, NO_SPRITES, SPRITE_HINTS, SPRITE_STEPS, TEXT_ENTRY, TILE_EXTRA, TILE_SIZES, VIRTUAL_LIST_MIN };
