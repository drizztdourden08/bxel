/* @layer core @kind logic */
import type { MapLayer } from '../model/tilemap.type';
import type { MapLayerFlags } from './map-layer-flags.type';

const mapLayerFlags = (layer: MapLayer): MapLayerFlags => ({
  name: layer.name,
  visible: layer.visible,
  locked: layer.locked,
  ...(layer.colour === undefined ? {} : { colour: layer.colour }),
});

export { mapLayerFlags };
