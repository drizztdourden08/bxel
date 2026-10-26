/* @layer renderer-app @kind constants */
import type { AssetKind } from '@bxel/document';
import type { IconName } from '@drizztdourden08/tessera';

const ASSET_ICON: Readonly<Record<AssetKind, IconName>> = {
  sprite: 'pixel-sprite',
  animation: 'pixel-animation',
  sheet: 'pixel-atlas',
  palette: 'pixel-palette',
  tileset: 'pixel-tileset',
  tilemap: 'pixel-tilemap',
  project: 'pixel-project',
};

const ASSET_TABS_TEXT = { label: 'Open assets' } as const;

const TAB_MENU = {
  zone: 'asset.tabs',
  tab: '[data-reorder-key]',
  label: 'Tab actions',
  reveal: 'Reveal in folder',
  copyPath: 'Copy path',
  move: 'Move tab',
  close: 'Close',
  closeOthers: 'Close other tabs',
  closeRight: 'Close tabs to the right',
  saved: 'This asset has no unsaved changes.',
  allSaved: 'No file has unsaved changes.',
  first: 'This is the first tab.',
  last: 'This is the last tab.',
  onlyTab: 'There is no other tab.',
} as const;

export { ASSET_ICON, ASSET_TABS_TEXT, TAB_MENU };
