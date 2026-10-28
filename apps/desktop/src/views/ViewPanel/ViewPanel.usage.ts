/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Holds the deep view controls of the canvas as collapsible sections: navigator, zoom, overlays, onion skin, tiled preview, symmetry and background.',
  useWhen: [
    'The user wants more than a quick toggle: grid spacing, onion settings, the background or an exact zoom.',
  ],
  avoidWhen: [
    { case: 'A quick on or off of one aid.', use: 'CanvasToolbar' },
  ],
  rules: [
    'It takes no props and shows only the sections the open asset can use.',
    'Grid spacing, major spacing, the background and the sheet marks are kept per asset and never exported.',
    'The tile grid follows the tileset tile size, the map cell or the sheet cell until the user sets its own size.',
  ],
  a11y: [
    'Each section is a disclosure button that tells whether it is open.',
    'Every toggle has a name and a description.',
  ],
  tree: {
    path: ['layout', 'panels the user docks and moves'],
    rule: 'ViewPanel is the View widget body.',
  },
  example: `import { ViewPanel } from '../ViewPanel';

const Widget = () => <ViewPanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
