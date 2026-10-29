/* @layer renderer-app @kind constants */
import type { IconName } from '@drizztdourden08/tessera';
import type { RowKind } from '../asset-list/asset-list.type';
import type { ItemKind, ItemState, ItemStatus } from './project-browser.type';
import type { ProjectViewSettings, SelectionState } from './browser-state.type';

const UNSAVED_KEY = 'group:unsaved';

const UNSAVED_NAME = 'Not saved yet';

const GROUP_PREFIX = 'group:';

const NARROW_WIDTH = 220;

const NEW_MENU_KEY = 'menu:new';

const FILE_NEW_KEY = 'new:file';

const MISSING_TOKEN = 'is:missing';

const DEFAULT_PROJECT_VIEW: ProjectViewSettings = {
  mode: 'tree',
  density: 'comfortable',
  tile: 64,
  group: 'kind',
  sort: 'name',
  follow: true,
  expanded: {},
};

const NO_SELECTION: SelectionState = { keys: new Set(), anchor: null, focus: null };

const NO_COLLAPSED: ReadonlySet<string> = new Set();

const NO_REFERRERS: ReadonlyMap<string, readonly string[]> = new Map();

const FILTER_KINDS: readonly RowKind[] = ['sprite', 'animation', 'sheet', 'palette', 'tileset', 'tilemap', 'image', 'other'];

const FILTER_STATES: readonly ItemState[] = ['unsaved', 'open', 'missing', 'unused'];

const STATE_LABEL: Readonly<Record<ItemState, string>> = {
  unsaved: 'Unsaved',
  open: 'Open',
  missing: 'Missing',
  unused: 'Unused',
};

const PLURAL_LABEL: Readonly<Record<RowKind, string>> = {
  sprite: 'Sprites',
  animation: 'Animations',
  sheet: 'Sheets',
  palette: 'Palettes',
  tileset: 'Tilesets',
  tilemap: 'Tilemaps',
  image: 'Images',
  other: 'Other files',
};

const ITEM_ICON: Readonly<Record<ItemKind, IconName>> = {
  sprite: 'pixel-sprite',
  animation: 'pixel-animation',
  sheet: 'pixel-atlas',
  palette: 'pixel-palette',
  tileset: 'pixel-tileset',
  tilemap: 'pixel-tilemap',
  image: 'image',
  other: 'file',
  folder: 'folder',
  project: 'pixel-project',
  legacy: 'pixel-legacy',
  group: 'layers',
};

const EMPTY_STATUS: ItemStatus = { unsaved: false, open: false, active: false, missing: [], usedBy: 0, unused: false, unsavedBelow: 0, missingBelow: 0 };

const PLAIN_KINDS: readonly string[] = ['image', 'other', 'folder', 'group', 'project', 'legacy'];

const USED_BY_KINDS: readonly string[] = ['sprite', 'animation', 'palette', 'tileset'];

export {
  DEFAULT_PROJECT_VIEW,
  EMPTY_STATUS,
  FILE_NEW_KEY,
  FILTER_KINDS,
  FILTER_STATES,
  GROUP_PREFIX,
  ITEM_ICON,
  MISSING_TOKEN,
  NARROW_WIDTH,
  NEW_MENU_KEY,
  NO_COLLAPSED,
  NO_REFERRERS,
  NO_SELECTION,
  PLAIN_KINDS,
  PLURAL_LABEL,
  STATE_LABEL,
  UNSAVED_KEY,
  UNSAVED_NAME,
  USED_BY_KINDS,
};
