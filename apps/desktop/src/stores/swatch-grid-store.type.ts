/* @layer renderer-app @kind types */
import type { VirtualGridHandle } from '@drizztdourden08/tessera';

interface SwatchGridState {
  handle: VirtualGridHandle | null;
  attach: (handle: VirtualGridHandle) => void;
  detach: (handle: VirtualGridHandle) => void;
}

export type { SwatchGridState };
