/* @layer renderer-app @kind component */
import { PixelThumbnail } from '@drizztdourden08/tessera';
import { thumbBox } from '../../../pixel-thumb/thumb-box';
import { THUMB_THROTTLE_MS } from '../LayerStack.constants';
import type { LayerThumbProps } from '../LayerStack.type';
import { useLayerThumb } from '../behavior/useLayerThumb';
import './LayerThumb.css';

const LayerThumb = ({ source, size, follow }: LayerThumbProps) => {
  const image = useLayerThumb(source, follow);
  return <PixelThumbnail image={image} box={thumbBox(size)} throttleMs={THUMB_THROTTLE_MS} className="layer-thumb" />;
};

export { LayerThumb };
