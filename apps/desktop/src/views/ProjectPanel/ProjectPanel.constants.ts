/* @layer renderer-app @kind constants */
import type { IconName, VirtualSize } from '@drizztdourden08/tessera';
import type { CreatableKind } from '../../stores/creation-store.type';
import type { ListGroup, TileSize } from '../../panel-browser/project-browser.type';

const CHIPS_SHOWN = 3;

const SEARCH_SELECTOR = '[data-project-search] input';

const NEW_BUTTON_SELECTOR = '[data-project-new]';

const NEW_ASSET_KINDS: readonly CreatableKind[] = ['sprite', 'animation', 'sheet', 'palette', 'tileset', 'tilemap'];

const NEW_KIND_LETTERS: Readonly<Record<string, CreatableKind>> = { s: 'sprite', a: 'animation', h: 'sheet', p: 'palette', t: 'tileset', m: 'tilemap' };

const OPEN_MENU_SELECTOR = '[role="menu"]';

const ITEM_ATTRIBUTE = 'data-tree-key';

const ITEM_SELECTOR = '[data-tree-key]';

const MIDDLE_BUTTON = 1;

const SPRING_OPEN_MS = 600;

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
  highlightOnly: 'Search only highlights',
  hub: 'Open the Project hub',
  settings: 'Project settings',
  pack: 'Pack project',
  close: 'Close project',
  openAll: 'Open all',
  openSide: 'Open to the side',
  moveTo: 'Move to folder...',
  showUses: 'Show what it uses',
  addToSheet: 'Add to the open sheet',
  makeAnimation: 'Make animation',
  collapseBelow: 'Collapse below',
  newSheetFrom: 'New sheet from these',
  newAnimationFrom: 'New animation from these',
  export: 'Export...',
  showUsers: 'Show what uses it',
  copyRelative: 'Copy path inside the project',
  locate: 'Locate file...',
  removeLink: 'Remove link',
  unlink: 'Unlink folder',
  trash: 'Move to trash',
  trashMany: (count: number): string => `Move ${count} items to trash`,
  duplicateMany: (count: number): string => `Duplicate ${count} items`,
  selected: (count: number): string => `${count} selected`,
} as const;

const PANEL_UI = {
  treeLabel: 'Project files',
  legacySplit: 'An old file with several assets in it. Open it, then split it into one file per asset.',
  legacySplitMark: 'Split',
  listLabel: 'Project assets',
  gridLabel: 'Project assets as tiles',
  searchLabel: 'Search the project',
  searchPlaceholder: 'Search',
  searchHelp: 'Words match names and folders. Tokens: kind:sprite, is:unsaved, is:open, is:unused, is:missing, uses:name or used:name (files that use it), usedby:name (files it uses), in:folder. Type a space after a token to make it a filter.',
  filterLabel: 'Filter by kind or state',
  clearFilters: 'Clear filters',
  clearLabel: 'Clear',
  showAll: 'Show every file',
  moreFilters: (count: number): string => `${count} more filters`,
  newLabel: 'New',
  newMenuLabel: 'Choose what to make',
  menuLabel: 'Project menu',
  optionsLabel: 'Tree and list options',
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
  assistantChanged: 'Changed by the assistant. Open it to clear this mark.',
} as const;

const BADGE_ICON: Readonly<Record<'missing' | 'readOnly' | 'open' | 'link' | 'assistant', IconName>> = {
  missing: 'triangle-alert',
  readOnly: 'lock',
  open: 'circle-dot',
  link: 'link',
  assistant: 'sparkles',
};

export {
  BADGE_ICON,
  CHIPS_SHOWN,
  GROUP_CHOICES,
  ITEM_ATTRIBUTE,
  ITEM_SELECTOR,
  MIDDLE_BUTTON,
  NEW_ASSET_KINDS,
  NEW_BUTTON_SELECTOR,
  NEW_KIND_LETTERS,
  OPEN_MENU_SELECTOR,
  PANEL_UI,
  PROJECT_MENU,
  SEARCH_SELECTOR,
  SPRING_OPEN_MS,
  TILE_BOX,
  TILE_CHOICES,
};
