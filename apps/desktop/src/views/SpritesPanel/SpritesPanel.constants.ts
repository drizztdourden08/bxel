/* @layer renderer-app @kind constants */
import type { SpriteId } from '@bxel/document';
import type { FieldDescriptor, TableColumn, ViewKey, VirtualSize } from '@drizztdourden08/tessera';
import { DIALOG_COMMAND } from '../../keymap/dialog-command-id.constants';
import { SHEET_COMMAND } from '../../keymap/sheet-command-id.constants';
import { FOLDER_TEXT } from '../../sheet-manager/folder-text.constants';
import { MANAGER_TEXT } from '../../sheet-manager/manager-text.constants';
import type { HintSpec } from '../ActionHint';
import type { EntryKind } from '../../sheet-manager/manager.type';
import type { ListRow } from './SpritesPanel.type';

const WIDE_SHAPE = { minWidth: 560, ratio: 1.8 } as const;

const SPRITES_WIDGET_ID = 'sprites';

const SHEET_VIEWS_KEY = 'sheet-views';

const NO_SPRITES: readonly SpriteId[] = [];

const ANY_SIZE = 'any';

const ARROW_STEP: Readonly<Record<string, number>> = { ArrowLeft: -1, ArrowRight: 1 };

const MARQUEE_ITEM = '[data-marquee-key]';


const GRID_CELL = '[role="gridcell"], [role="cell"], [role="row"]';

const VIRTUAL_LIST_MIN = 200;

const END_INDEX = 100000;

const SPRITE_MENU = {
  label: 'Sprite actions',
  edit: 'Edit sprite',
  renameMany: 'Rename several...',
  needTwo: 'Pick at least two sprites.',
  duplicateNamed: 'Duplicate with a name...',
  moveToFolder: 'Move to folder...',
  palette: 'Palette...',
  oneBank: 'This file has only one palette.',
  noSheet: 'There is no sheet.',
  drop: (name: string): string => `Delete saved selection ${name}`,
} as const;

const FOLDER_DEPTH_LIMIT = 4;

const TEXT_ENTRY = 'input:not([type="checkbox"]), textarea, [contenteditable="true"]';

const CHECKBOX = 'input[type="checkbox"]';

const LIST_HEAD_ROOM = 48;

const LIST_LABEL = 'Sprites';

const LIST_THUMB = 32;

const LIST_ROW_HEIGHT: VirtualSize = 'size-40';

const NAME_PATH = 'name';

const LIST_VIEW_KEY = 'bxel:sprite-list';

const LIST_COUNT_LABEL = ['sprite', 'sprites'] as const;

const LIST_FIELDS: readonly { readonly path: keyof ListRow; readonly label: string; readonly kind: 'string' | 'number'; readonly width: number }[] = [
  { path: 'name', label: MANAGER_TEXT.columns.name, kind: 'string', width: 192 },
  { path: 'width', label: MANAGER_TEXT.columns.width, kind: 'number', width: 120 },
  { path: 'height', label: MANAGER_TEXT.columns.height, kind: 'number', width: 120 },
  { path: 'pivot', label: MANAGER_TEXT.columns.pivot, kind: 'string', width: 128 },
  { path: 'bank', label: MANAGER_TEXT.columns.bank, kind: 'string', width: 120 },
  { path: 'at', label: MANAGER_TEXT.columns.at, kind: 'string', width: 104 },
  { path: 'frames', label: MANAGER_TEXT.columns.frames, kind: 'string', width: 96 },
];

const LIST_EXTRA_FIELDS: readonly { readonly path: keyof ListRow; readonly label: string; readonly kind: 'string' | 'number'; readonly width: number }[] = [
  { path: 'entry', label: MANAGER_TEXT.columns.entry, kind: 'string', width: 96 },
  { path: 'page', label: MANAGER_TEXT.columns.page, kind: 'string', width: 72 },
  { path: 'usedBy', label: MANAGER_TEXT.columns.usedBy, kind: 'string', width: 168 },
];

const LIST_FOLDER_FIELD: FieldDescriptor = { path: 'folder', label: FOLDER_TEXT.field, kind: 'string', optional: false, hidden: true };

const LIST_SCHEMA: readonly FieldDescriptor[] = [
  ...[...LIST_FIELDS, ...LIST_EXTRA_FIELDS].map(({ path, label, kind }): FieldDescriptor => ({ path, label, kind, optional: false })),
  LIST_FOLDER_FIELD,
];

const LIST_COLUMNS: readonly TableColumn[] = LIST_FIELDS.map(({ path, width }) => ({ path, width }));

const listViewKey = (sheetId: string | null): ViewKey => `${LIST_VIEW_KEY}:${sheetId ?? 'none'}`;

const IN_LIST = 'In the list';

const ANIMATION_SECTION = 'entries:animations';

const ENTRY_KINDS: readonly EntryKind[] = ['all', 'sprites', 'animations'];

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

export { ANIMATION_SECTION, ANY_SIZE, ARROW_STEP, CHECKBOX, END_INDEX, ENTRY_KINDS, FOLDER_DEPTH_LIMIT, GRID_CELL, LIST_COLUMNS, LIST_COUNT_LABEL, LIST_HEAD_ROOM, LIST_LABEL, LIST_ROW_HEIGHT, LIST_SCHEMA, LIST_THUMB, listViewKey, MARQUEE_ITEM,NAME_PATH, NO_SPRITES, SPRITE_HINTS, SHEET_VIEWS_KEY, SPRITE_MENU, SPRITES_WIDGET_ID, TEXT_ENTRY, VIRTUAL_LIST_MIN, WIDE_SHAPE };
