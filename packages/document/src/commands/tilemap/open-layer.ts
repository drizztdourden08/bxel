/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { requireTileset } from '../../read/require-tileset';
import { assertLayerEditable } from './assert-layer-editable';
import type { LayerOptions, OpenedLayer } from './map-layer.type';
import { pickMapLayer } from './pick-map-layer';
import { pickTilemap } from './pick-tilemap';

const openLayer = (draft: Draft, options: LayerOptions): OpenedLayer => {
  const tilemap = pickTilemap(draft, options.tilemap);
  const { layer } = pickMapLayer(tilemap, options.layer);
  assertLayerEditable(layer);
  return { tilemap, layer, tileset: requireTileset(draft.artwork, tilemap.tilesetId) };
};

export { openLayer };
