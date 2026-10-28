/* @layer renderer-app @kind constants */
import type { IconName, VirtualSize } from '@drizztdourden08/tessera';
import type { AssetKey } from '@bxel/document';
import type { RowKind } from '../asset-list/asset-list.type';
import type { BrowserFacts, BrowserQuery, BrowserSort, BrowserView, QueryFlag, RowCells, SavedBrowserView, SavedFilter, Selection, SortKey } from './project-browser.type';

const DEFAULT_SORT: BrowserSort = { key: 'name', descending: false };

const DEFAULT_VIEW: SavedBrowserView = { view: 'grid', size: 96, sort: DEFAULT_SORT, preview: true, folder: null, pinned: [], smart: [] };

const THUMB_STOPS: readonly number[] = [48, 64, 80, 96, 128, 160, 192, 224];

const TILE_OF: Readonly<Record<number, { readonly width: VirtualSize; readonly height: VirtualSize }>> = {
  48: { width: 'size-64', height: 'size-80' },
  64: { width: 'size-80', height: 'size-96' },
  80: { width: 'size-96', height: 'size-128' },
  96: { width: 'size-128', height: 'size-128' },
  128: { width: 'size-160', height: 'size-160' },
  160: { width: 'size-192', height: 'size-192' },
  192: { width: 'size-224', height: 'size-224' },
  224: { width: 'size-256', height: 'size-256' },
};

const MAX_SAVED_BROWSERS = 100;

const SAVE_DELAY_MS = 400;

const VIEW_OPTIONS: readonly { readonly value: BrowserView; readonly label: string; readonly icon: IconName }[] = [
  { value: 'grid', label: 'Grid', icon: 'pixel-grid-view' },
  { value: 'list', label: 'List', icon: 'pixel-list-view' },
  { value: 'columns', label: 'Columns', icon: 'columns-3' },
];

const SORT_OPTIONS: readonly { readonly value: SortKey; readonly label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'kind', label: 'Kind' },
  { value: 'modified', label: 'Modified' },
  { value: 'folder', label: 'Folder' },
  { value: 'size', label: 'Size in pixels' },
  { value: 'frames', label: 'Frames' },
  { value: 'usedBy', label: 'Used by' },
];

const FLAG_LABEL: Readonly<Record<QueryFlag, string>> = { unused: 'Unused', unsaved: 'Unsaved', open: 'Open in a tab', pinned: 'Pinned' };

const BUILT_IN_FILTERS: readonly SavedFilter[] = [
  { id: 'built-in:unsaved', name: 'Unsaved', query: 'is:unsaved' },
  { id: 'built-in:open', name: 'Open in a tab', query: 'is:open' },
  { id: 'built-in:unused', name: 'Unused', query: 'is:unused' },
  { id: 'built-in:pinned', name: 'Pinned', query: 'is:pinned' },
];

const BROWSER_TEXT = {
  windowTitle: 'Browse',
  searchLabel: 'Search the project',
  searchPlaceholder: 'Search, or type kind:sprite is:unsaved in:sprites size>64',
  searchHelp:
    'Words match names and folders. Tokens: kind:sprite, in:folder, uses:name (files that use it), usedby:name (files it uses), is:unused, is:unsaved, is:open, is:pinned, size>64, colours<16. Kinds add up, other tokens narrow.',
  clearSearch: 'Clear the search',
  back: 'Back',
  forward: 'Forward',
  up: 'Up one folder',
  refresh: 'Refresh',
  viewGroup: 'View',
  sort: 'Sort by',
  descending: 'Largest first',
  ascending: 'Smallest first',
  thumbSize: 'Thumbnail size',
  newAsset: 'New',
  newFolder: 'New folder',
  import: 'Import',
  more: 'More',
  pack: 'Pack project...',
  revealProject: 'Show the project folder in Explorer',
  sources: 'Sources',
  folders: 'Folders',
  pinned: 'Pinned',
  filters: 'Smart filters',
  saveFilter: 'Save as smart filter',
  filterName: 'Smart filter name',
  removeFilter: (name: string): string => `Remove the filter ${name}`,
  noPinned: 'Pin a file to keep it here.',
  files: 'Files',
  emptyFolderTitle: 'This folder is empty',
  emptyFolderMessage: 'Make something here, or drop files in.',
  emptySearchTitle: 'Nothing matches',
  emptySearchMessage: 'No file fits all of the search. Remove a token or clear the search.',
  noProjectTitle: 'No project is open',
  noProjectMessage: 'Open a project to browse its files, or pick one of the projects below.',
  selectOne: 'Pick a file to see it here.',
  selectedMany: (count: number): string => `${count} files selected`,
  statusFiles: (count: number): string => `${count} ${count === 1 ? 'file' : 'files'}`,
  statusSelected: (count: number): string => `${count} selected`,
  statusUnsaved: (count: number): string => `${count} unsaved`,
  statusFolder: (count: number): string => `${count} ${count === 1 ? 'folder' : 'folders'}`,
  readOnly: 'This project is closed. You can look at it, but nothing in it can change.',
  open: 'Open',
  properties: 'Properties',
  rename: 'Rename',
  duplicate: 'Duplicate',
  moveTo: 'Move to...',
  trash: 'Move to the trash',
  reveal: 'Show in Explorer',
  copyPath: 'Copy path',
  pin: 'Pin',
  unpin: 'Unpin',
  findUses: 'Find files that use it',
  findUsedBy: 'Find files it uses',
  unsavedBadge: 'Unsaved',
  openBadge: 'Open in a tab',
  pinnedBadge: 'Pinned',
  unusedBadge: 'Unused',
  usedBy: (count: number): string => `Used by ${count}`,
  uses: (count: number): string => `Uses ${count}`,
  inFolder: (name: string): string => `In ${name}`,
  columnName: 'Name',
  columnKind: 'Kind',
  columnSize: 'Size',
  columnFrames: 'Frames',
  columnPalette: 'Palette',
  columnFolder: 'Folder',
  columnModified: 'Modified',
  columnUsedBy: 'Used by',
  folderCount: (count: number): string => `${count} ${count === 1 ? 'item' : 'items'}`,
  linkedFolder: 'Linked folder',
  pixels: (width: number, height: number): string => `${width} x ${height}`,
  frames: (count: number): string => `${count} ${count === 1 ? 'frame' : 'frames'}`,
  breadcrumbs: 'Folder path',
  siblings: 'Folders here',
  gridLabel: 'Project files',
  listLabel: 'Project files, as a table',
  columnsLabel: 'Project files, in columns',
  previewLabel: 'Preview',
  noPreviewMany: 'Several files selected',
  previewHide: 'Hide the preview',
  previewShow: 'Show the preview',
  fileMoved: (name: string): string => `Moved ${name}.`,
  folderMade: (name: string): string => `Made the folder ${name}.`,
  folderFailed: (reason: string): string => `Could not make the folder. ${reason}`,
  folderNamePrompt: 'Folder name',
  newFolderDefault: 'New folder',
  imageHint: 'Open to import it as a sprite',
  copied: 'Copied the path.',
} as const;

const EMPTY_SELECTION: Selection = { ids: [], anchor: null };

const NO_FACTS: BrowserFacts = { width: null, height: null, frames: null, palette: null, colours: null, uses: [], usedBy: [], open: false };

const EMPTY_QUERY: BrowserQuery = { words: [], kinds: [], inFolder: null, uses: [], usedBy: [], is: [], size: [], colours: [], chips: [] };

const QUERY_FLAGS: readonly QueryFlag[] = ['unused', 'unsaved', 'open', 'pinned'];

const KIND_ALIAS: Readonly<Record<string, RowKind>> = { map: 'tilemap', tiles: 'tileset', anim: 'animation', atlas: 'sheet', png: 'image', gif: 'image', bmp: 'image' };

const LEAF_KINDS: ReadonlySet<string> = new Set(['sprite', 'animation', 'palette', 'tileset']);

const NO_TREE = { files: [], folders: [] } as const;

const SWATCH_THUMB = { columns: 4, cell: 4, limit: 16 } as const;

const OVERFLOW_AFTER = 4;

const NO_KEYS: ReadonlyMap<string, AssetKey> = new Map();

const EMPTY_CELLS: RowCells = { kind: '', size: '', frames: '', palette: '', folder: '', modified: '', users: '' };

export { BROWSER_TEXT, NO_KEYS, EMPTY_CELLS, EMPTY_QUERY, EMPTY_SELECTION, KIND_ALIAS, LEAF_KINDS, NO_FACTS, NO_TREE, OVERFLOW_AFTER, QUERY_FLAGS, SWATCH_THUMB, BUILT_IN_FILTERS, DEFAULT_SORT, DEFAULT_VIEW, FLAG_LABEL, MAX_SAVED_BROWSERS, SAVE_DELAY_MS, SORT_OPTIONS, THUMB_STOPS, TILE_OF, VIEW_OPTIONS };
