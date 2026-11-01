/* @layer core @kind logic */
import { ancestorsOf } from '../layer-tree/ancestors-of';
import type { Layer, Sprite } from '../model/sprite.type';
import { clipBaseIndex } from './clip-base-index';
import { layerKindOf } from './layer-kind-of';

const leftOut = (layers: readonly Layer[], layer: Layer): boolean =>
  layerKindOf(layer) === 'reference' || [layer, ...ancestorsOf(layers, layer)].some((each) => each.exported === false);

const exportedSprite = (sprite: Sprite): Sprite => {
  const { layers } = sprite;
  const dropped = new Set(layers.filter((layer) => leftOut(layers, layer)).map((layer) => layer.id));
  layers.forEach((layer, index) => {
    const base = layers[clipBaseIndex(layers, index)];
    if (base && dropped.has(base.id)) dropped.add(layer.id);
  });
  return dropped.size === 0 ? sprite : { ...sprite, layers: layers.filter((layer) => !dropped.has(layer.id)) };
};

export { exportedSprite };
