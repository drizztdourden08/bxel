/* @layer renderer-app @kind types */
import type { RgbaPicture } from '@bxel/document';
import type { Clip } from '../editor/selection/selection.type';

interface DropLayerOffer {
  name: string;
  clip: Clip;
  picture: RgbaPicture | null;
}

interface DropLayerState {
  offer: DropLayerOffer | null;
  show: (offer: DropLayerOffer) => void;
  hide: () => void;
}

export type { DropLayerState };
