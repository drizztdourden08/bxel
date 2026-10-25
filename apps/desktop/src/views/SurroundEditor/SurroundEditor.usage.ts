/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lets the user draw a custom 16 by 16 surround pattern, cell by cell, in the Surround settings of the Canvas page.',
  useWhen: [
    'The Surround settings need the custom pattern editor under the pattern, colour and size rows.',
    'A pattern of two colours is drawn cell by cell.',
  ],
  avoidWhen: [
    { case: 'A single colour is set.', use: 'ColorPickerPopover' },
    { case: 'Only a choice from a list is needed.', use: 'Select' },
  ],
  rules: [
    'It takes no props. It reads and writes the canvas settings: the pattern kind and the 16 by 16 custom bits.',
    'The cells use the two surround colours, and a cell that is on carries a light mark so the pattern stays readable.',
    'Click or drag over cells to turn them on or off; the first cell pressed decides whether the drag turns cells on or off.',
    'Editing a cell makes the pattern Custom. Start from the chosen pattern copies the preset that is chosen now.',
  ],
  a11y: [
    'The grid is one Tab stop; the arrow keys move the cell and Space or Enter turns it on or off.',
  ],
  tree: {
    path: ['a value the user sets', 'one choice', 'a few, all in view'],
    rule: 'SurroundEditor edits the custom canvas surround pattern.',
  },
  example: `import { SurroundEditor } from '../SurroundEditor';

const CustomPatternRow = () => <SurroundEditor />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
