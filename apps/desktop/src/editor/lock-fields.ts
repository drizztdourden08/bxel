/* @layer renderer-app @kind logic */
import type { LayerFields, LockKind } from './layer-lock.type';

const lockFields = (kind: LockKind): LayerFields => ({ locked: kind === 'pixels', lockTransparency: kind === 'transparency' });

export { lockFields };
