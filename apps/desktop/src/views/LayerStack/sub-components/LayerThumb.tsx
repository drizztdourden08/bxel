/* @layer renderer-app @kind component */
import type { CSSProperties } from 'react';
import { Box, Canvas } from '@drizztdourden08/tessera';
import { useLayerThumb } from '../behavior/useLayerThumb';
import type { LayerThumbProps } from '../LayerStack.type';
import './LayerThumb.css';

const boxStyle = (size: number): CSSProperties => ({ '--layer-thumb': `${size}px` }) as CSSProperties;

/** The pixels of one layer, nearest neighbour on the checker. It draws again when that layer changes, and follows the brush on the active layer. */
const LayerThumb = ({ source, size, follow }: LayerThumbProps) => {
  const canvas = useLayerThumb(source, follow);
  return (
    <Box className="layer-thumb" style={boxStyle(size)} aria-hidden>
      <Canvas ref={canvas} className="layer-thumb__canvas" aria-hidden="true" />
    </Box>
  );
};

export { LayerThumb };
