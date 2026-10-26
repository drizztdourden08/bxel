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

const ASSET_HUB = 'asset';

const PROJECT_HUB = 'project';

const ASSET_SETTINGS_COMMAND = 'asset.settings';

const CONFIG_ENTRY_TEXT = {
  noAsset: 'Asset settings...',
  title: (kind: AssetKind): string => `${KIND_TITLE[kind]} settings...`,
} as const;

export { ASSET_HUB, ASSET_PAGES, ASSET_SETTINGS_COMMAND, CONFIG_ENTRY_TEXT, PROJECT_HUB };
