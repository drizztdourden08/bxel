/* @layer renderer-app @kind logic */
import type { MapLayer } from '@bxel/document';
import { layerStateOf } from './layer-state-of';
import type { MapHeader } from './stage-header.type';

type MapLayerHeader = Pick<MapHeader, 'layerId' | 'layerName' | 'layerState'>;

const mapLayerHeader = (layer: MapLayer | null | undefined): MapLayerHeader => ({
  layerId: layer?.id ?? null,
  layerName: layer?.name ?? null,
  layerState: layer ? layerStateOf(layer) : '',
});

export { mapLayerHeader };
