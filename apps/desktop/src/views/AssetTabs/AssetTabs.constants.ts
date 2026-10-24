/* @layer renderer-app @kind constants */
import type { AssetKind } from '@bxel/document';
import type { IconName } from '@drizztdourden08/tessera';

const ASSET_ICON: Readonly<Record<AssetKind, IconName>> = {
  sprite: 'image',
  sheet: 'layout-grid',
  palette: 'palette',
  tileset: 'puzzle',
  tilemap: 'map',
  project: 'folder',
};

const ASSET_TABS_TEXT = { label: 'Open assets' } as const;

export { ASSET_ICON, ASSET_TABS_TEXT };
