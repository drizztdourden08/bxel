/* @layer renderer-app @kind types */
import type { MapHeader } from './stage-header.type';

type MapLayerHeader = Pick<MapHeader, 'layerId' | 'layerName' | 'layerState'>;

export type { MapLayerHeader };
