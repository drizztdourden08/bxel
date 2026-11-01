/* @layer renderer-app @kind component */
import { useRef } from 'react';
import { Box } from '@drizztdourden08/tessera';
import { FullscreenPreview } from './sub-components/FullscreenPreview';
import { Loupe } from './sub-components/Loupe';
import { ZoomHud } from './sub-components/ZoomHud';
import type { CanvasOverlaysProps } from './CanvasOverlays.type';
import './CanvasOverlays.css';

const CanvasOverlays = ({ source, viewport }: CanvasOverlaysProps) => {
  const host = useRef<HTMLElement>(null);
  return (
    <>
      <Box ref={host} className="canvas-overlays">
        <Loupe host={host} viewport={viewport} source={source} />
        <ZoomHud />
      </Box>
      <FullscreenPreview source={source} />
    </>
  );
};

export { CanvasOverlays };
