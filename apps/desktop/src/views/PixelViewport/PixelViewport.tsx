/* @layer renderer-app @kind component */
import { Box, Canvas, Text } from '@drizztdourden08/tessera';
import { PIXEL_VIEWPORT_STRINGS } from './PixelViewport.constants';
import { usePixelViewport } from './behavior/usePixelViewport';
import type { PixelViewportProps } from './PixelViewport.type';
import './PixelViewport.css';

const PixelViewport = (props: PixelViewportProps) => {
  const { label, className } = props;
  const viewport = usePixelViewport(props);
  return (
    <Box
      ref={viewport.rootRef}
      className={className ? `pixel-viewport ${className}` : 'pixel-viewport'}
      tabIndex={0}
      role="application"
      aria-label={label}
      aria-roledescription={PIXEL_VIEWPORT_STRINGS.role}
      {...viewport.handlers}
    >
      <Canvas ref={viewport.canvasRef} className="pixel-viewport__canvas" aria-hidden="true" />
      <Text as="span" className="pixel-viewport__status" aria-live="polite">{viewport.announcement}</Text>
    </Box>
  );
};

export { PixelViewport };
