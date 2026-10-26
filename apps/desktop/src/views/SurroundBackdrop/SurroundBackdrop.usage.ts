/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Draws the surround pattern behind the whole work area, under the canvas, the bars and every part that is transparent.',
  useWhen: ['A screen or frame shows the canvas look behind its content.'],
  avoidWhen: [{ case: 'The user sets the pattern.', use: 'SurroundEditor' }],
  rules: [
    'It takes no props. It reads the surround pattern, its colours and its size from the canvas settings.',
    'Pass it as the BrockApp background, which keeps it behind the whole app. A frame that is positioned and isolates its stacking can also mount it first, as the image preview does.',
    'It repaints on every change of the settings and when its box resizes.',
  ],
  a11y: ['It is hidden from assistive technology and takes no pointer input.'],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'SurroundBackdrop paints the surround pattern behind the app content.',
  },
  example: `import { SurroundBackdrop } from '../SurroundBackdrop';

const Frame = () => <SurroundBackdrop />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
