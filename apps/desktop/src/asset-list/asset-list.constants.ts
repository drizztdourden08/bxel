/* @layer renderer-app @kind constants */
import type { IconName } from '@drizztdourden08/tessera';
import type { AssetChip, AssetQuery, ChipOption, RowKind, SortOption } from './asset-list.type';

const CHIP_OPTIONS: readonly ChipOption[] = [
  { value: 'all', label: 'All' },
  { value: 'sprite', label: 'Sprites' },
  { value: 'sheet', label: 'Sheets' },
  { value: 'palette', label: 'Palettes' },
  { value: 'tilemap', label: 'Tilemaps' },
  { value: 'image', label: 'Images' },
  { value: 'other', label: 'Other' },
];

const SORT_OPTIONS: readonly SortOption[] = [
  { value: 'name', label: 'Name' },
  { value: 'kind', label: 'Kind' },
  { value: 'modified', label: 'Modified' },
  { value: 'folder', label: 'Folder' },
];

const CHIP_OF_KIND: Readonly<Record<RowKind, AssetChip>> = {
  sprite: 'sprite',
  sheet: 'sheet',
  palette: 'palette',
  tileset: 'tilemap',
  tilemap: 'tilemap',
  image: 'image',
  other: 'other',
};

const KIND_ORDER: readonly RowKind[] = ['sprite', 'sheet', 'palette', 'tileset', 'tilemap', 'image', 'other'];

const KIND_LABEL: Readonly<Record<RowKind, string>> = {
  sprite: 'Sprite',
  sheet: 'Sheet',
  palette: 'Palette',
  tileset: 'Tileset',
  tilemap: 'Tilemap',
  image: 'Image',
  other: 'File',
};

const DEFAULT_QUERY: AssetQuery = { chip: 'all', sort: 'name', search: '', usedBySprite: null };

const KIND_ICON: Readonly<Record<RowKind, IconName>> = {
  sprite: 'pixel-pencil',
  sheet: 'pixel-grid-view',
  palette: 'pixel-palette',
  tileset: 'pixel-tileset',
  tilemap: 'map',
  image: 'image',
  other: 'file',
};

const DRIVE_PATH = /^[A-Za-z]:\//;

const WINDOWS_SEPARATOR = '\\';

const WATCH_DELAY_MS = 250;

export { CHIP_OF_KIND, CHIP_OPTIONS, DEFAULT_QUERY, DRIVE_PATH, KIND_ICON, KIND_LABEL, KIND_ORDER, SORT_OPTIONS, WATCH_DELAY_MS, WINDOWS_SEPARATOR };
