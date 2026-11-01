/* @layer renderer-app @kind logic */
import type { LockKind, LockSource } from './layer-lock.type';
import { lockKindOf } from './layer-lock-kind';

const layerLockKindOf = (layer: LockSource | undefined): LockKind => (layer ? lockKindOf(layer) : 'none');

export { layerLockKindOf };
