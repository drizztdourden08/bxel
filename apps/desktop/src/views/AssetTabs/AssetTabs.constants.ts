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

export { ASSET_ICON, ASSET_TABS_TEXT };
