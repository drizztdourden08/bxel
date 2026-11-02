/* @layer renderer-app @kind hook */
import { focusAssetOf } from '../../../asset-config/focus-asset-of';
import { useAssetFocus } from '../../../asset-config/useAssetFocus';
import { OVERVIEW_TEXT } from '../../../asset-overview/asset-overview.constants';

const useTileSize = (): string | null => {
  const focus = useAssetFocus();
  const tileset = focus ? focusAssetOf(focus, 'tileset') : undefined;
  return tileset ? OVERVIEW_TEXT.pixelSize(tileset.tileWidth, tileset.tileHeight) : null;
};

export { useTileSize };
