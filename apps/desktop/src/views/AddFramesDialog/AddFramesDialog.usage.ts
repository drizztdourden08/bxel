/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Write the one job of AddFramesDialog in one sentence.',
  useWhen: ['Write a case where AddFramesDialog is the part to use.'],
  avoidWhen: [{ case: 'Write a case where a plain Box fits better than AddFramesDialog.', use: 'Box' }],
  rules: ['Write a rule every use of AddFramesDialog follows.'],
  a11y: ['Write what AddFramesDialog gives a keyboard or screen reader user.'],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'Write in one line why AddFramesDialog answers a question the user must answer.',
  },
  example: `import { AddFramesDialog } from '../AddFramesDialog';

const AddFramesDialogSample = () => <AddFramesDialog title="Add frames dialog" />;
`,
  propsHash: '89718877731ae6d2',
} satisfies ComponentUsage;

export { usage };
