/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Draws the surround pattern behind the picture inside a canvas viewport, and nowhere else.',
  useWhen: ['A canvas viewport shows the canvas look behind its picture.'],
  avoidWhen: [{ case: 'The user sets the pattern.', use: 'SurroundEditor' }],
  rules: [
    'It takes no props. It reads the surround pattern, its colours and its size from the canvas settings.',
    'Mount it first inside a frame that is positioned and isolates its stacking, as the pixel viewport does. Never mount it behind panels, bars or the app.',
    'It repaints on every change of the settings and when its box resizes.',
  ],
  a11y: ['It is hidden from assistive technology and takes no pointer input.'],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'SurroundBackdrop paints the surround pattern behind the picture of a viewport.',
  },
  example: `import { SurroundBackdrop } from '../SurroundBackdrop';

const Frame = () => <SurroundBackdrop />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
