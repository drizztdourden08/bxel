/* @layer renderer-app @kind hook */
import { useLivePaintStore } from '../../../stores/useLivePaintStore';
import type { FrameImage } from '../../../sheet/sheet.type';
import type { LayerThumbSource } from '../LayerStack.type';
import { keptLayerImage } from './kept-layer-image';
import { useLivePaintTick } from './useLivePaintTick';

const useLayerThumb = (source: LayerThumbSource, follow: boolean): FrameImage => {
  const stroke = useLivePaintTick(follow);
  const live = useLivePaintStore((state) => (follow ? state.session : null));
  return keptLayerImage(source, live, stroke);
};

export { useLayerThumb };
