/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lets the user pick the canvas surround pattern and draw a custom 16 by 16 pattern, with a live preview of the surround behind a checkerboard.',
  useWhen: [
    'A settings page needs the custom surround pattern editor beside a preview.',
    'A pattern of two colours is drawn cell by cell.',
  ],
  avoidWhen: [
    { case: 'A single colour is set.', use: 'ColorPickerPopover' },
    { case: 'Only a choice from a list is needed.', use: 'Select' },
  ],
  rules: [
    'It takes no props. It reads and writes the canvas settings: the pattern kind and the 16 by 16 custom bits.',
    'The preview repaints on every change and uses the colours and the size of the Canvas settings.',
    'Click or drag over cells to turn them on or off; the first cell pressed decides whether the drag turns cells on or off.',
    'Editing a cell makes the pattern Custom. Copy the chosen pattern starts a custom pattern from a preset.',
  ],
  a11y: [
    'The grid is one Tab stop; the arrow keys move the cell and Space or Enter turns it on or off.',
    'The preview is a labelled image.',
  ],
  tree: {
    path: ['a value the user sets', 'one choice', 'a few, all in view'],
    rule: 'SurroundEditor edits the canvas surround pattern with a live preview.',
  },
  example: `import { SurroundEditor } from '../SurroundEditor';

const SurroundPage = () => <SurroundEditor />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
