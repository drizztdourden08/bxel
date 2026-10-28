/* @layer renderer-app @kind component */
import { Box, Canvas } from '@drizztdourden08/tessera';
import { useLayerThumb } from '../behavior/useLayerThumb';
import type { LayerThumbProps } from '../LayerStack.type';
import './LayerThumb.css';

const LayerThumb = ({ source, size, follow }: LayerThumbProps) => {
  const canvas = useLayerThumb(source, follow);
  return (
    <Box className="layer-thumb" data-size={size} aria-hidden>
      <Canvas ref={canvas} className="layer-thumb__canvas" aria-hidden="true" />
    </Box>
  );
};

export { LayerThumb };
