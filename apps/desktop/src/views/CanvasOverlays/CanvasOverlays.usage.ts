/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Draws the floating helpers of the pixel canvas inside the viewport: the loupe beside the pointer, the zoom readout and the fullscreen preview.',
  useWhen: [
    'The sprite canvas needs a magnifier, a quiet zoom readout or a clean look at the art at a whole number scale.',
  ],
  avoidWhen: [
    { case: 'The user wants an exact zoom or a typed percent.', use: 'ZoomField' },
  ],
  rules: [
    'Render it as the child of a PixelViewport and pass the pixels that are shown and the viewport ref.',
    'The loupe follows the pointer pixel of the readout store and shows four times the current zoom; it sits beside the pointer and never covers it.',
    'The zoom readout shows for one second after the zoom changes; a double click on it fits the view. Reduced motion shows it with no fade.',
    'The fullscreen preview fills the window at the largest whole number scale, and any key or click returns.',
  ],
  a11y: [
    'The loupe and the readout are hidden from assistive technology; the zoom is spoken by the viewport and the fullscreen preview announces when it opens and closes.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'CanvasOverlays holds the loupe, the zoom readout and the fullscreen preview of the pixel canvas.',
  },
  example: `import { useRef } from 'react';
import { CanvasOverlays } from '../CanvasOverlays';
import { PixelViewport } from '../PixelViewport';
import type { PixelViewportHandle } from '../PixelViewport';

const Stage = ({ image }: { image: ImageData }) => {
  const viewport = useRef<PixelViewportHandle>(null);
  return (
    <PixelViewport ref={viewport} label="Canvas" width={image.width} height={image.height} source={image}>
      <CanvasOverlays source={image} viewport={viewport} />
    </PixelViewport>
  );
};
`,
  propsHash: 'd48e879937c6c688',
} satisfies ComponentUsage;

export { usage };
