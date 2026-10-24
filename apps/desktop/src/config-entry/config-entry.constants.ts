/* @layer renderer-app @kind constants */
import type { AssetKind } from '@bxel/document';
import type { AssetSection } from './config-entry.type';

const ASSET_PAGES: Readonly<Record<AssetKind, Readonly<Record<AssetSection, string>>>> = {
  sprite: { main: 'sprite', palette: 'sprite-palette', platform: 'sprite-platform' },
  sheet: { main: 'sheet', palette: 'sheet', platform: 'sheet' },
  palette: { main: 'palette', palette: 'palette', platform: 'palette' },
  tileset: { main: 'tileset', palette: 'tileset', platform: 'tileset' },
  tilemap: { main: 'tilemap', palette: 'tilemap', platform: 'tilemap' },
  project: { main: 'none', palette: 'none', platform: 'none' },
};

const KIND_TITLE: Readonly<Record<AssetKind, string>> = {
  sprite: 'Sprite',
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
