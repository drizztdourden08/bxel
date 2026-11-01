/* @layer renderer-app @kind types */
import type { LayerRowKind } from '../LayerStack.type';

interface LayerKindMarkProps {
  kind: LayerRowKind;
  folded: boolean;
}

export type { LayerKindMarkProps };
