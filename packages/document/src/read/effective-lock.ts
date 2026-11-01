/* @layer core @kind logic */
import { ancestorsOf } from '../layer-tree/ancestors-of';
import type { Layer, LayerLock } from '../model/sprite.type';

const effectiveLock = (layers: readonly Layer[], layer: Layer): LayerLock =>
  ancestorsOf(layers, layer).reduce<LayerLock>(
    (lock, parent) => ({
      pixels: lock.pixels || parent.lock.pixels,
      transparency: lock.transparency || parent.lock.transparency,
      position: lock.position || parent.lock.position,
    }),
    layer.lock,
  );

export { effectiveLock };
