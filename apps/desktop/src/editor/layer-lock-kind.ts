/* @layer renderer-app @kind logic */
import type { LockKind, LockSource } from './layer-lock.type';

const lockKindOf = (layer: LockSource): LockKind => {
  const lock = layer.lock ?? { pixels: layer.locked === true, transparency: false, position: false };
  if (lock.pixels) return 'pixels';
  if (lock.transparency) return 'transparency';
  return lock.position ? 'position' : 'none';
};

export { lockKindOf };
