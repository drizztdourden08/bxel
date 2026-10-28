/* @layer renderer-app @kind logic */
import type { MapLayerId } from '@bxel/document';
import { changeMapLayers } from './change-map-layers';
import type { MapLayerFields } from './map-layer-fields.type';

const updateMapLayers = (ids: readonly MapLayerId[], fields: MapLayerFields, label: string): boolean => changeMapLayers([{ ids, fields }], label);

export { updateMapLayers };
