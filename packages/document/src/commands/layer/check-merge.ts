/* @layer core @kind logic */
import type { Layer } from '../../model/sprite.type';
import { ERROR_CODE } from '../error-code.constants';
import { failIfAny } from './fail-if-any';
import { layerIssue } from './layer-issue';
import type { PickedLayer } from './layer.type';

const belowOf = ({ sprite, index }: PickedLayer): Layer | undefined => sprite.layers[index - 1];

const checkMerge = (picked: readonly PickedLayer[], allowLocked: boolean): void => {
  failIfAny(
    ERROR_CODE.NO_LAYER_BELOW,
    'Cannot merge down from the bottom layer.',
    picked.filter((item) => item.index === 0).map(({ sprite, layer }) => layerIssue(sprite.id, layer, 'it is the bottom layer')),
  );
  const pairs = picked.flatMap((item) => {
    const below = belowOf(item);
    return below ? [{ spriteId: item.sprite.id, layers: [item.layer, below] }] : [];
  });
  failIfAny(
    ERROR_CODE.LAYER_HIDDEN,
    'A hidden layer is not merged. Show it first.',
    pairs.flatMap(({ spriteId, layers }) => layers.filter((layer) => !layer.visible).map((layer) => layerIssue(spriteId, layer, 'hidden'))),
  );
  if (allowLocked) return;
  failIfAny(
    ERROR_CODE.LAYER_LOCKED,
    'A locked layer is merged only with allowLocked.',
    pairs.flatMap(({ spriteId, layers }) => layers.filter((layer) => layer.locked).map((layer) => layerIssue(spriteId, layer, 'locked'))),
  );
};

export { checkMerge };
