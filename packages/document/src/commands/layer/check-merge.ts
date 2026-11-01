/* @layer core @kind logic */
import { shownInTree } from '../../layer-tree/shown-in-tree';
import type { Layer } from '../../model/sprite.type';
import { layerKindOf } from '../../read/layer-kind-of';
import { pixelsLocked } from '../../read/pixels-locked';
import { siblingBelow } from '../../read/sibling-below';
import { ERROR_CODE } from '../error-code.constants';
import { failIfAny } from './fail-if-any';
import { layerIssue } from './layer-issue';
import type { PickedLayer } from './layer.type';

const belowOf = ({ sprite, index }: PickedLayer): Layer | undefined => siblingBelow(sprite.layers, index);

const pixelPair = (item: PickedLayer): boolean => {
  const below = belowOf(item);
  return layerKindOf(item.layer) === 'pixel' && below !== undefined && layerKindOf(below) === 'pixel';
};

const checkMerge = (picked: readonly PickedLayer[], allowLocked: boolean): void => {
  failIfAny(
    ERROR_CODE.NO_LAYER_BELOW,
    'Cannot merge down from the bottom layer.',
    picked.filter((item) => item.index === 0).map(({ sprite, layer }) => layerIssue(sprite.id, layer, 'it is the bottom layer')),
  );
  failIfAny(
    ERROR_CODE.NO_LAYER_BELOW,
    'Merge down needs a pixel layer and a pixel layer under it in the same group.',
    picked.filter((item) => !pixelPair(item)).map(({ sprite, layer }) => layerIssue(sprite.id, layer, 'no pixel layer below it in its group')),
  );
  const pairs = picked.flatMap((item) => {
    const below = belowOf(item);
    return below ? [{ spriteId: item.sprite.id, sprite: item.sprite, layers: [item.layer, below] }] : [];
  });
  failIfAny(
    ERROR_CODE.LAYER_HIDDEN,
    'A hidden layer is not merged. Show it first.',
    pairs.flatMap(({ spriteId, sprite, layers }) => layers.filter((layer) => !shownInTree(sprite.layers, layer)).map((layer) => layerIssue(spriteId, layer, 'hidden'))),
  );
  if (allowLocked) return;
  failIfAny(
    ERROR_CODE.LAYER_LOCKED,
    'A locked layer is merged only with allowLocked.',
    pairs.flatMap(({ spriteId, layers, sprite }) => layers.filter((layer) => pixelsLocked(sprite, layer)).map((layer) => layerIssue(spriteId, layer, 'locked'))),
  );
};

export { checkMerge };
