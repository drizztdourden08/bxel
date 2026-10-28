/* @layer renderer-app @kind logic */
import type { Layer } from '@bxel/document';
import type { LockKind } from './layer-lock.type';

const lockKindOf = (layer: Pick<Layer, 'locked' | 'lockTransparency'>): LockKind => {
  if (layer.locked) return 'pixels';
  return layer.lockTransparency === true ? 'transparency' : 'none';
};

export { lockKindOf };
