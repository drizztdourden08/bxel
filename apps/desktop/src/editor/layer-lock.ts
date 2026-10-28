/* @layer renderer-app @kind logic */
import type { Layer } from '@bxel/document';
import type { LayerFields, LockKind } from './layer-lock.type';

const lockKindOf = (layer: Pick<Layer, 'locked' | 'lockTransparency'>): LockKind => {
  if (layer.locked) return 'pixels';
  return layer.lockTransparency === true ? 'transparency' : 'none';
};

const lockFields = (kind: LockKind): LayerFields => ({ locked: kind === 'pixels', lockTransparency: kind === 'transparency' });

/** The fields a flag change sets. Turning the lock off clears every kind of lock, and turning it on is the pixels lock. */
const flagFields = (flag: 'visible' | 'locked', value: boolean): LayerFields => (flag === 'visible' ? { visible: value } : lockFields(value ? 'pixels' : 'none'));

export { flagFields, lockFields, lockKindOf };
