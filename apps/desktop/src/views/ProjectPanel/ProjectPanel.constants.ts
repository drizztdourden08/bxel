/* @layer renderer-app @kind constants */
import type { IconName, VirtualSize } from '@drizztdourden08/tessera';
import type { CreatableKind } from '../../stores/creation-store.type';
import type { ListGroup, TileSize, ViewDensity } from '../../project-browser/project-browser.type';

const CHIPS_SHOWN = 3;

const SEARCH_SELECTOR = '[data-project-search] input';

const NEW_BUTTON_SELECTOR = '[data-project-new]';

const ROOT_DROP = 'root';

const NAV_KEYS: readonly string[] = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'];

const NEW_ASSET_KINDS: readonly CreatableKind[] = ['sprite', 'animation', 'sheet', 'palette', 'tileset', 'tilemap'];

const ITEM_ATTRIBUTE = 'data-item-key';

const ITEM_SELECTOR = '[data-item-key]';

const ROW_INDEX_ATTRIBUTE = 'data-row-index';

const DENSITY_HEIGHT: Readonly<Record<ViewDensity, number>> = { compact: 24, comfortable: 36, grid: 36 };

const DENSITY_THUMB: Readonly<Record<ViewDensity, number>> = { compact: 16, comfortable: 32, grid: 32 };

const KIND_SHORTCUT: Readonly<Record<CreatableKind, string>> = { sprite: 'S', animation: 'A', sheet: 'H', palette: 'P', tileset: 'T', tilemap: 'M' };

const TILE_CHOICES: readonly { readonly size: TileSize; readonly label: string }[] = [
  { size: 48, label: 'Tiles, small' },
  { size: 64, label: 'Tiles, medium' },
  { size: 96, label: 'Tiles, large' },
];

const TILE_BOX: Readonly<Record<TileSize, { readonly width: VirtualSize; readonly height: VirtualSize }>> = {
  48: { width: 'size-64', height: 'size-80' },
  64: { width: 'size-80', height: 'size-96' },
  96: { width: 'size-128', height: 'size-128' },
};

const GROUP_CHOICES: readonly { readonly value: ListGroup; readonly label: string }[] = [
  { value: 'kind', label: 'Sections by kind' },
  { value: 'folder', label: 'Sections by folder' },
  { value: 'none', label: 'No sections' },
];

const PROJECT_MENU = {
  zone: 'project.start',
  label: 'Project actions',
  newAsset: 'New asset',
  newFolder: 'New folder',
  newAssetHere: 'New asset here',
  newFolderHere: 'New folder here',
  refresh: 'Refresh',
  revealRoot: 'Reveal the project folder',
  collapseAll: 'Collapse all folders',
  hub: 'Open the Project hub',
  settings: 'Project settings',
  pack: 'Pack project',
  close: 'Close project',
  openAll: 'Open all',
  export: 'Export...',
  showUsers: 'Show what uses it',
  copyRelative: 'Copy path inside the project',
  unlink: 'Unlink folder',
  trash: 'Move to trash',
  trashMany: (count: number): string => `Move ${count} items to trash`,
  duplicateMany: (count: number): string => `Duplicate ${count} items`,
  selected: (count: number): string => `${count} selected`,
} as const;

const PANEL_UI = {
  treeLabel: 'Project files',
  listLabel: 'Project assets',
  gridLabel: 'Project assets as tiles',
  searchLabel: 'Search the project',
  searchPlaceholder: 'Search, or kind:sprite is:unsaved',
  filterLabel: 'Filter by kind or state',
  clearFilters: 'Clear filters',
  moreFilters: (count: number): string => `${count} more filters`,
  newLabel: 'New',
  newMenuLabel: 'Choose what to make',
  menuLabel: 'Project menu',
  optionsLabel: 'View options',
  assistantLabel: (level: string): string => `Assistant access: ${level}`,
  loading: 'Reading the project',
  emptyTitle: 'No assets yet',
  emptyMessage: 'Make a sprite, a palette or a sheet to start.',
  emptyFolder: 'This folder is empty.',
  nothingMatches: 'Nothing matches the filters.',
  notGranted: 'Bxel needs your permission to look in this folder.',
  grant: 'Allow access',
  folderGone: 'This folder cannot be read. It may have moved.',
  unlink: 'Remove the link',
  truncated: 'The project is very large, so the list is cut short.',
  readOnly: 'Read only. Allow access to see this folder.',
  actions: (name: string): string => `Actions for ${name}`,
  dropHint: 'Drop to move here',
  renameLabel: 'New name',
  newFolderLabel: 'Folder name',
  newSpriteLabel: 'Sprite name',
  nameError: 'Pick a name that is not taken.',
  openDemo: 'Open the demo project',
  newProject: 'New project',
  openProject: 'Open project',
  noProjectTitle: 'No project open',
  noProjectMessage: 'A project keeps several files and folders together, and can let an assistant browse them.',
  recent: 'Recent projects',
  removeRecent: 'Remove from list',
  switchProject: 'Switch project',
  noRecents: 'No recent projects',
} as const;

const BADGE_ICON: Readonly<Record<'missing' | 'readOnly' | 'open' | 'link', IconName>> = {
  missing: 'triangle-alert',
  readOnly: 'lock',
  open: 'circle-dot',
  link: 'link',
};

export {
  BADGE_ICON,
  CHIPS_SHOWN,
  DENSITY_HEIGHT,
  DENSITY_THUMB,
  GROUP_CHOICES,
  ITEM_ATTRIBUTE,
  ITEM_SELECTOR,
  KIND_SHORTCUT,
  NAV_KEYS,
  NEW_ASSET_KINDS,
  NEW_BUTTON_SELECTOR,
  PANEL_UI,
  PROJECT_MENU,
  ROOT_DROP,
  ROW_INDEX_ATTRIBUTE,
  SEARCH_SELECTOR,
  TILE_BOX,
  TILE_CHOICES,
};
