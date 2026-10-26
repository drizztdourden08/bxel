/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Write the one job of StripFields in one sentence.',
  useWhen: ['Write a case where StripFields is the part to use.'],
  avoidWhen: [{ case: 'Write a case where a plain Box fits better than StripFields.', use: 'Box' }],
  rules: ['Write a rule every use of StripFields follows.'],
  a11y: ['Write what StripFields gives a keyboard or screen reader user.'],
  tree: {
    path: ['a value the user sets', 'one choice', 'a few, all in view'],
    rule: 'Write in one line why StripFields answers a few, all in view.',
  },
  example: `import { StripFields } from '../StripFields';

const StripFieldsSample = () => <StripFields title="Strip fields" />;
`,
  propsHash: '89718877731ae6d2',
} satisfies ComponentUsage;

export { usage };
