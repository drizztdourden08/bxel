/* @layer renderer-app @kind component */
import { useId } from 'react';
import { Box, Canvas, Text } from '@drizztdourden08/tessera';
import { PIXEL_VIEWPORT_STRINGS } from './PixelViewport.constants';
import { pixelViewportClass } from './behavior/pixel-viewport-class';
import { usePixelViewport } from './behavior/usePixelViewport';
import type { PixelViewportProps } from './PixelViewport.type';
import './PixelViewport.css';

const PixelViewport = (props: PixelViewportProps) => {
  const { label, className, hand, hint } = props;
  const hintId = useId();
  const viewport = usePixelViewport(props);
  return (
    <Box
      ref={viewport.rootRef}
      className={pixelViewportClass(className, hand === true)}
      tabIndex={0}
      role="application"
      aria-label={label}
      aria-roledescription={PIXEL_VIEWPORT_STRINGS.role}
      aria-describedby={hint ? hintId : undefined}
      {...viewport.handlers}
    >
      {hint && <Text as="span" id={hintId} className="visually-hidden">{hint}</Text>}
      <Canvas ref={viewport.canvasRef} className="pixel-viewport__canvas" aria-hidden="true" />
      <Text as="span" className="pixel-viewport__status" aria-live="polite">{viewport.announcement}</Text>
    </Box>
  );
};

export { PixelViewport };
