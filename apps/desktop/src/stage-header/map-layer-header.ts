/* @layer renderer-app @kind logic */
import type { MapLayer } from '@bxel/document';
import { layerStateOf } from './layer-state-of';
import type { MapLayerHeader } from './map-layer-header.type';

const mapLayerHeader = (layer: MapLayer | null | undefined): MapLayerHeader => ({
  layerId: layer?.id ?? null,
  layerName: layer?.name ?? null,
  layerState: layer ? layerStateOf(layer) : '',
});

export { mapLayerHeader };
