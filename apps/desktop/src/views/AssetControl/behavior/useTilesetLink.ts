/* @layer renderer-app @kind hook */
import { useCallback } from 'react';
import { focusAssetOf } from '../../../asset-config/focus-asset-of';
import { useAssetFocus } from '../../../asset-config/useAssetFocus';
import { showLinked } from '../../../asset-overview/show-linked';
import type { TilesetLinkModel } from '../AssetControl.type';

const useTilesetLink = (): TilesetLinkModel | null => {
  const focus = useAssetFocus();
  const map = focus ? focusAssetOf(focus, 'tilemap') : undefined;
  const tileset = focus && map ? focus.artwork.tilesets.find((each) => each.id === map.tilesetId) : undefined;
  const open = useCallback((): void => {
    if (focus && tileset) showLinked(focus.documentId, { kind: 'tileset', id: tileset.id });
  }, [focus, tileset]);
  return tileset ? { name: tileset.name, open } : null;
};

export { useTilesetLink };
