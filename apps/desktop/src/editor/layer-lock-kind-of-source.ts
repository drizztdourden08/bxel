/* @layer renderer-app @kind logic */
import type { LockKind } from './layer-lock.type';
import { lockKindOf } from './layer-lock-kind';

const layerLockKindOf = (layer: { locked: boolean; lockTransparency?: boolean } | undefined): LockKind => (layer ? lockKindOf(layer) : 'none');

export { layerLockKindOf };
