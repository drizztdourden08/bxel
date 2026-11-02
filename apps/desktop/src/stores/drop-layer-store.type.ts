/* @layer renderer-app @kind types */
import type { Clip } from '../editor/selection/selection.type';

interface DropLayerOffer {
  name: string;
  clip: Clip;
}

interface DropLayerState {
  offer: DropLayerOffer | null;
  show: (offer: DropLayerOffer) => void;
  hide: () => void;
}

export type { DropLayerState };
