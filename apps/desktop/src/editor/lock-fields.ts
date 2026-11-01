/* @layer renderer-app @kind logic */
import type { LayerFields, LockKind } from './layer-lock.type';

const lockFields = (kind: LockKind): LayerFields => ({ lock: { pixels: kind === 'pixels', transparency: kind === 'transparency', position: kind === 'position' } });

export { lockFields };
