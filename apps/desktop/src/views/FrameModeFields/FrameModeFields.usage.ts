/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Write the one job of FrameModeFields in one sentence.',
  useWhen: ['Write a case where FrameModeFields is the part to use.'],
  avoidWhen: [{ case: 'Write a case where a plain Box fits better than FrameModeFields.', use: 'Box' }],
  rules: ['Write a rule every use of FrameModeFields follows.'],
  a11y: ['Write what FrameModeFields gives a keyboard or screen reader user.'],
  tree: {
    path: ['a value the user sets', 'one choice', 'a few, all in view'],
    rule: 'Write in one line why FrameModeFields answers a few, all in view.',
  },
  example: `import { FrameModeFields } from '../FrameModeFields';

const FrameModeFieldsSample = () => <FrameModeFields title="Frame mode fields" />;
`,
  propsHash: '89718877731ae6d2',
} satisfies ComponentUsage;

export { usage };
