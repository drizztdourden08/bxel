/* @layer renderer-app @kind logic */
import type { LayerRowHead } from './layer-row-head.type';
import { lockKindOf } from './layer-lock-kind';
import type { LockSource } from './layer-lock.type';

const layerRowHead = (layer: LockSource & { readonly id: string; readonly name: string; readonly visible: boolean; readonly colour?: string | null }): LayerRowHead => ({
  id: layer.id,
  name: layer.name,
  visible: layer.visible,
  mixedVisible: false,
  lock: lockKindOf(layer),
  mixedLock: false,
  colour: layer.colour ?? null,
});

export { layerRowHead };
