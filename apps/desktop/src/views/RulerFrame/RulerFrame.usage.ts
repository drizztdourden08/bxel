/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Puts the top and left rulers around a canvas, the same way for the sprite, the sheet and the map.',
  useWhen: [
    'A canvas shows an image whose positions the user measures or marks with guides.',
  ],
  avoidWhen: [
    { case: 'A canvas with no ruler.', use: 'PixelViewport' },
  ],
  rules: [
    'It wraps one PixelViewport and shows the rulers when the Rulers toggle is on.',
    'Give the viewport the FRAMED_VIEWPORT class so it sits in the second row and column.',
  ],
  a11y: [
    'Each ruler is a button named Horizontal ruler or Vertical ruler that opens its menu with Enter or Space.',
  ],
  tree: {
    path: ['layout', 'a plain block'],
    rule: 'RulerFrame lays out the rulers and the viewport as one grid.',
  },
  example: `import { RulerFrame } from '../RulerFrame';
import { PixelViewport } from '../PixelViewport';

const Stage = () => <RulerFrame><PixelViewport width={16} height={16} label="Sprite canvas" /></RulerFrame>;
`,
  propsHash: '1bc5bf568a454eb2',
} satisfies ComponentUsage;

export { usage };
