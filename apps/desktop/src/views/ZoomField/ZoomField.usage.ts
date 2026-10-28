/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Sets the zoom of the canvas as a typed percent, a slider, presets and the Fit, 1:1 and Selection buttons.',
  useWhen: [
    'The user wants an exact zoom, or a zoom below 100 percent for a sheet or a map.',
  ],
  avoidWhen: [
    { case: 'The user only needs to zoom a step in or out.', use: 'CanvasToolbar' },
  ],
  rules: [
    'It takes no props. It follows the zoom of the canvas and writes it back through the viewport handle.',
    'The percent runs from 25 to 12800. Typing a value and pressing Enter or leaving the field applies it, Escape drops the draft.',
    'The slider is logarithmic so each doubling takes the same width.',
  ],
  a11y: [
    'The field is named Zoom percent and marks a value it cannot read as invalid.',
    'Presets are toggle buttons that report which one is on.',
  ],
  tree: {
    path: ['a value the user sets', 'a range'],
    rule: 'ZoomField is the zoom control of the View widget.',
  },
  example: `import { ZoomField } from '../ZoomField';

const Side = () => <ZoomField />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
