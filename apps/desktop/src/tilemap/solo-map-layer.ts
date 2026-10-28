/* @layer renderer-app @kind logic */
import type { MapLayer } from '@bxel/document';
import { soloMemory } from '../editor/solo-memory';
import { currentMap } from './current-map';
import { TILE_LABEL } from './tilemap.constants';
import { changeMapLayers } from './change-map-layers';
import { isSoloMapLayer } from './is-solo-map-layer';

const soloMapLayer = (layerId?: string): void => {
  const target = currentMap();
  const { layers = [], id: mapId = '' } = target?.tilemap ?? {};
  const chosen = layers.find((layer) => layer.id === (layerId ?? target?.layer.id));
  if (!chosen) return;
  const solo = isSoloMapLayer(layers, chosen.id);
  const earlier = soloMemory.get(mapId);
  if (!solo) soloMemory.set(mapId, new Map(layers.map((layer) => [layer.id, layer.visible])));
  const wanted = (layer: MapLayer): boolean => (solo ? (earlier?.get(layer.id) ?? true) : layer.id === chosen.id);
  const show = layers.filter((layer) => wanted(layer) && !layer.visible).map((layer) => layer.id);
  const hide = layers.filter((layer) => !wanted(layer) && layer.visible).map((layer) => layer.id);
  changeMapLayers([{ ids: hide, fields: { visible: false } }, { ids: show, fields: { visible: true } }], TILE_LABEL.layerSolo);
};

export { soloMapLayer };
