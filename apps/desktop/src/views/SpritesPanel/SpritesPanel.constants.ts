/* @layer renderer-app @kind constants */
import type { SpriteId } from '@bxel/document';
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

const BAND_MIN = 4;

const END_INDEX = 100000;

const MANAGER_TABS = [
  { id: 'sprites', label: MANAGER_TEXT.tabs.sprites },
  { id: 'atlas', label: MANAGER_TEXT.tabs.atlas },
];

const LIST_COLUMNS: readonly ListColumn[] = [
  { key: 'name', label: 'name' },
  { key: 'size', label: 'size' },
  { key: null, label: 'pivot' },
  { key: 'frames', label: 'frames' },
  { key: null, label: 'tags' },
  { key: null, label: 'bank' },
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

export { ANY_SIZE, ARROW_STEP, BAND_MIN, DRAG_TYPE, END_INDEX, LIST_COLUMNS, LIST_THUMB, MANAGER_TABS, NO_SPRITES, SPRITE_HINTS };
