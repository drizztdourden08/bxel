/* @layer renderer-app @kind constants */
import type { AssetKind } from '@bxel/document';
import type { AssetSection } from './config-entry.type';

const ASSET_PAGES: Readonly<Record<AssetKind, Readonly<Record<AssetSection, string>>>> = {
  sprite: { main: 'sprite', palette: 'sprite-palette', platform: 'sprite-platform', overview: 'overview' },
  animation: { main: 'animation', palette: 'animation', platform: 'animation', overview: 'overview' },
  sheet: { main: 'sheet', palette: 'sheet', platform: 'sheet', overview: 'overview' },
  palette: { main: 'palette', palette: 'palette', platform: 'palette', overview: 'overview' },
  tileset: { main: 'tileset', palette: 'tileset', platform: 'tileset', overview: 'overview' },
  tilemap: { main: 'tilemap', palette: 'tilemap', platform: 'tilemap', overview: 'overview' },
  project: { main: 'none', palette: 'none', platform: 'none', overview: 'none' },
};

const KIND_TITLE: Readonly<Record<AssetKind, string>> = {
  sprite: 'Sprite',
  animation: 'Animation',
  sheet: 'Sheet',
  palette: 'Palette',
  tileset: 'Tileset',
  tilemap: 'Tilemap',
  project: 'Asset',
};

const PROPERTIES_HUB = 'properties';

const PROJECT_HUB = 'project';

const LEGACY_ROUTES: Readonly<Record<string, string>> = { asset: PROPERTIES_HUB, app: 'options' };

const ASSET_SETTINGS_COMMAND = 'asset.settings';

const CONFIG_ENTRY_TEXT = {
  noAsset: 'Properties...',
  title: (kind: AssetKind): string => `${KIND_TITLE[kind]} properties...`,
} as const;

export { ASSET_PAGES, ASSET_SETTINGS_COMMAND, CONFIG_ENTRY_TEXT, LEGACY_ROUTES, PROJECT_HUB, PROPERTIES_HUB };
