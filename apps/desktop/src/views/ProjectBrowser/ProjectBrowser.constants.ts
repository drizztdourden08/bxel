/* @layer renderer-app @kind constants */
import type { CreatableKind } from '../../stores/creation-store.type';
import { BROWSER_TEXT } from '../../project-browser/project-browser.constants';
import type { Column } from './ProjectBrowser.type';

const IMAGE_FILTERS = [{ name: 'Images', extensions: ['png', 'gif', 'bmp'] }];

const NEW_KINDS: readonly CreatableKind[] = ['sprite', 'animation', 'sheet', 'palette', 'tileset', 'tilemap'];

const LIST_COLUMNS: readonly Column[] = [
  { key: 'name', label: BROWSER_TEXT.columnName, className: 'browser-row__name' },
  { key: 'kind', label: BROWSER_TEXT.columnKind, className: 'browser-row__cell' },
  { key: 'size', label: BROWSER_TEXT.columnSize, className: 'browser-row__cell browser-row__cell--size' },
  { key: 'frames', label: BROWSER_TEXT.columnFrames, className: 'browser-row__cell browser-row__cell--frames' },
  { key: 'name', label: BROWSER_TEXT.columnPalette, className: 'browser-row__cell browser-row__cell--palette' },
  { key: 'folder', label: BROWSER_TEXT.columnFolder, className: 'browser-row__cell browser-row__cell--folder' },
  { key: 'modified', label: BROWSER_TEXT.columnModified, className: 'browser-row__cell browser-row__cell--modified' },
  { key: 'usedBy', label: BROWSER_TEXT.columnUsedBy, className: 'browser-row__cell browser-row__cell--users' },
];

const MIDDLE_BUTTON = 1;
const TYPE_AHEAD_RESET_MS = 800;
const SPRING_OPEN_MS = 600;

export { IMAGE_FILTERS, LIST_COLUMNS, MIDDLE_BUTTON, NEW_KINDS, SPRING_OPEN_MS, TYPE_AHEAD_RESET_MS };
