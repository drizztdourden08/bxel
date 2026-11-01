/* @layer renderer-app @kind types */
import type { LayerLock } from '@bxel/document';

type LockKind = 'none' | 'transparency' | 'pixels' | 'position';

type LockPart = keyof LayerLock;

interface LockSource {
  lock?: LayerLock;
  locked?: boolean;
}

interface LayerFields {
  name?: string;
  visible?: boolean;
  locked?: boolean;
  lockTransparency?: boolean;
  lock?: Partial<LayerLock>;
  viewOpacity?: number;
  clip?: boolean;
  exported?: boolean;
  colour?: string | null;
}

export type { LayerFields, LockKind, LockSource };
