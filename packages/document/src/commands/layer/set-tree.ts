/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { updateSprite } from '../../draft/update-sprite';
import { MAX_LAYER_DEPTH } from '../../layer-tree/layer-tree.constants';
import { treeTooDeep } from '../../layer-tree/tree-too-deep';
import type { SpriteId } from '../../model/ids.type';
import type { Layer } from '../../model/sprite.type';
import { ERROR_CODE } from '../error-code.constants';
import { failIfAny } from './fail-if-any';
import { layerIssue } from './layer-issue';

const setTree = (draft: Draft, spriteId: SpriteId, layers: readonly Layer[]): void => {
  const deep = treeTooDeep(layers);
  failIfAny(ERROR_CODE.LAYER_DEPTH, `Groups nest ${MAX_LAYER_DEPTH} levels deep at most.`, deep ? [layerIssue(spriteId, deep, 'it would sit too deep')] : []);
  updateSprite(draft, spriteId, (sprite) => ({ ...sprite, layers }));
};

export { setTree };
