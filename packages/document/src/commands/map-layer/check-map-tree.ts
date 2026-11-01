/* @layer core @kind logic */
import { MAX_LAYER_DEPTH } from '../../layer-tree/layer-tree.constants';
import { treeTooDeep } from '../../layer-tree/tree-too-deep';
import type { MapLayer } from '../../model/tilemap.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const checkMapTree = (layers: readonly MapLayer[]): void => {
  const deep = treeTooDeep(layers);
  if (deep) throw fail(ERROR_CODE.LAYER_DEPTH, `Groups nest ${MAX_LAYER_DEPTH} levels deep at most. Map layer "${deep.name}" would sit too deep.`);
};

export { checkMapTree };
