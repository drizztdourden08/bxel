/* @layer renderer-app @kind logic */
import { findTilemap, isGroupItem } from '@bxel/document';
import type { Artwork, TilemapId } from '@bxel/document';
import type { PreviewLayer } from './asset-overview.type';

const tilemapLayers = (artwork: Artwork, id: string): readonly PreviewLayer[] => {
  const tilemap = findTilemap(artwork, id as TilemapId);
  if (!tilemap) return [];
  return tilemap.layers.filter((layer) => !isGroupItem(layer)).map((layer) => ({ id: layer.id, name: layer.name, visible: layer.visible }));
};

export { tilemapLayers };
