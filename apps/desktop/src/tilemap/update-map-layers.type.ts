/* @layer renderer-app @kind types */
import type { MapLayerId } from '@bxel/document';
import type { MapLayerFields } from './map-layer-fields.type';

interface MapLayerChange {
  ids: readonly MapLayerId[];
  fields: MapLayerFields;
}

export type { MapLayerChange };
