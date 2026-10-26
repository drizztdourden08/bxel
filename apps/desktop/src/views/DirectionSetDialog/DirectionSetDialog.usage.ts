/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Write the one job of DirectionSetDialog in one sentence.',
  useWhen: ['Write a case where DirectionSetDialog is the part to use.'],
  avoidWhen: [{ case: 'Write a case where a plain Box fits better than DirectionSetDialog.', use: 'Box' }],
  rules: ['Write a rule every use of DirectionSetDialog follows.'],
  a11y: ['Write what DirectionSetDialog gives a keyboard or screen reader user.'],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'Write in one line why DirectionSetDialog answers a question the user must answer.',
  },
  example: `import { DirectionSetDialog } from '../DirectionSetDialog';

const DirectionSetDialogSample = () => <DirectionSetDialog title="Direction set dialog" />;
`,
  propsHash: '89718877731ae6d2',
} satisfies ComponentUsage;

export { usage };
