/* @layer core @kind logic */
import type { MapLayer } from '../../model/tilemap.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const assertLayerEditable = (layer: MapLayer): void => {
  if (layer.locked) throw fail(ERROR_CODE.LAYER_LOCKED, `Map layer "${layer.name}" is locked.`, { path: 'options.layer' });
  if (!layer.visible) throw fail(ERROR_CODE.LAYER_HIDDEN, `Map layer "${layer.name}" is hidden.`, { path: 'options.layer' });
};

export { assertLayerEditable };
