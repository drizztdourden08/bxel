/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Fills the canvas area with one button per file type when the owner presses the plus of the asset tabs.',
  useWhen: [
    'The owner pressed the plus in the asset tab strip and has not picked a type yet.',
  ],
  avoidWhen: [{ case: 'A list is empty because a filter matched nothing.', use: 'EmptyState' }],
  rules: [
    'It takes no props and reads the new file panel store.',
    'Each button carries the icon of its file type and opens the create dialog with that type chosen.',
    'It closes when another tab becomes active.',
  ],
  a11y: [
    'The panel is a focus region named New file, and each button is named by its file type.',
  ],
  tree: {
    path: ['feedback', 'a note that stays on the page'],
    rule: 'FileTypePicker is the page the plus of the asset tabs opens, with one button per file type.',
  },
  example: `import { FileTypePicker } from '../FileTypePicker';

const NewFilePage = () => <FileTypePicker />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
