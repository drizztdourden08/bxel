/* @layer renderer-app @kind types */
import type { LockKind } from './layer-lock.type';

interface LayerRowHead {
  id: string;
  name: string;
  visible: boolean;
  mixedVisible: boolean;
  lock: LockKind;
  mixedLock: boolean;
  colour: string | null;
}

export type { LayerRowHead };
