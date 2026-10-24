/* @layer core @kind logic */
import type { TilesetId } from '../model/ids.type';
import type { MapLayer, Tilemap } from '../model/tilemap.type';
import { cellKey } from '../tilemap/cell-key';
import type { KeyChange } from '../tilemap/key-change.type';
import { replaceKeyInCells } from '../tilemap/replace-key-in-cells';
import type { Draft } from './draft.type';
import { updateArtwork } from './update-artwork';

const rewriteLayer = (layer: MapLayer, change: KeyChange): MapLayer => {
  if (!layer.cells.some((cell) => cellKey(cell) === change.from)) return layer;
  const cells = layer.cells.slice();
  replaceKeyInCells(cells, change);
  return { ...layer, cells };
};

const rewriteMap = (tilemap: Tilemap, change: KeyChange): Tilemap => {
  const layers = tilemap.layers.map((layer) => rewriteLayer(layer, change));
  return layers.every((layer, index) => layer === tilemap.layers[index]) ? tilemap : { ...tilemap, layers };
};

const rekeyTilesetMaps = (draft: Draft, tilesetId: TilesetId, change: KeyChange): void => {
  updateArtwork(draft, (artwork) => ({
    ...artwork,
    tilemaps: artwork.tilemaps.map((tilemap) => (tilemap.tilesetId === tilesetId ? rewriteMap(tilemap, change) : tilemap)),
  }));
};

export { rekeyTilesetMaps };
