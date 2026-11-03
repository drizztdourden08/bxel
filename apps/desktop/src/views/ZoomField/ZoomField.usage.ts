/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Sets the zoom of the canvas as a typed percent, step buttons, preset chips and the Fit, 1:1 and Selection buttons.',
  useWhen: [
    'The user wants an exact zoom, or a zoom below 100 percent for a sheet or a map.',
  ],
  avoidWhen: [
    { case: 'The user only needs to zoom a step in or out.', use: 'CanvasToolbar' },
  ],
  rules: [
    'It takes no props. It follows the zoom of the canvas and writes it back through the viewport handle.',
    'The percent runs from 25 to 12800. It is a Tessera ZoomField, so the step buttons, the arrow keys and the wheel walk along the preset stops. Fit, 1:1 and Selection are passed to it as its actions.',
  ],
  a11y: [
    'The field is named Zoom and its buttons are named Zoom out and Zoom in.',
    'Presets are in a group named Zoom levels and the one that is on is pressed.',
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
