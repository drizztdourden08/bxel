/* @layer core @kind types */
import type { MapLayer } from '../model/tilemap.type';

type MapLayerFlags = Pick<MapLayer, 'name' | 'visible' | 'locked' | 'colour' | 'kind' | 'parentId' | 'opacity'>;

export type { MapLayerFlags };
