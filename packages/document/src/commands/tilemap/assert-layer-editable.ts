/* @layer core @kind logic */
import { ancestorsOf } from '../../layer-tree/ancestors-of';
import { isGroupItem } from '../../layer-tree/is-group-item';
import { shownInTree } from '../../layer-tree/shown-in-tree';
import type { MapLayer } from '../../model/tilemap.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const assertLayerEditable = (layer: MapLayer, layers: readonly MapLayer[] = [layer]): void => {
  const path = 'options.layer';
  if (isGroupItem(layer)) throw fail(ERROR_CODE.LAYER_KIND, `Map layer "${layer.name}" is a group and holds no cells.`, { path });
  if (layer.locked || ancestorsOf(layers, layer).some((parent) => parent.locked)) throw fail(ERROR_CODE.LAYER_LOCKED, `Map layer "${layer.name}" is locked.`, { path });
  if (!shownInTree(layers, layer)) throw fail(ERROR_CODE.LAYER_HIDDEN, `Map layer "${layer.name}" is hidden.`, { path });
};

export { assertLayerEditable };
