/* @layer renderer-app @kind constants */
import type { SpriteId } from '@bxel/document';
import { MANAGER_TEXT } from '../../sheet-manager/manager-text.constants';
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

export { ANY_SIZE, ARROW_STEP, BAND_MIN, DRAG_TYPE, END_INDEX, LIST_COLUMNS, LIST_THUMB, MANAGER_TABS, NO_SPRITES };
