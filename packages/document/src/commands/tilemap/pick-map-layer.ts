/* @layer core @kind logic */
import type { Tilemap } from '../../model/tilemap.type';
import type { MapLayerRef } from '../../schema/command-options.type';
import { nameKey } from '../../validate/name-key';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import type { PickedMapLayer } from './map-layer.type';

const pickMapLayer = (tilemap: Tilemap, ref: MapLayerRef): PickedMapLayer => {
  const index = tilemap.layers.findIndex((layer) =>
    ref.by === 'id' ? layer.id === ref.id : nameKey(layer.name) === nameKey(ref.name),
  );
  const layer = tilemap.layers[index];
  if (!layer) {
    const named = ref.by === 'id' ? ref.id : `"${ref.name}"`;
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Map layer ${named} does not exist in tilemap "${tilemap.name}".`, {
      path: 'options.layer',
    });
  }
  return { layer, index };
};

export { pickMapLayer };
