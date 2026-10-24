/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Tells the user which picked sprites cannot take a shared edit and offers the two ways to fix it: add the missing layer or narrow the pick.',
  useWhen: [
    'Paint all selected is on and a picked sprite lacks the layer, the size or the palette.',
    'A layer command for several sprites finds a sprite that lacks the layer.',
  ],
  avoidWhen: [
    { case: 'A preview waits for Apply or Cancel.', use: 'ApplyBar' },
    { case: 'A message only informs and asks nothing.', use: 'Toast' },
  ],
  rules: [
    'The bar reads the open file and the sprite store, so it takes no props.',
    'The bar shows nothing while every picked sprite can take the edit.',
    'Add layer makes the missing layer in one undo step, and Narrow keeps only the sprites that fit.',
  ],
  a11y: [
    'The bar is an alert, so the cause is read when it shows.',
    'Both fixes are buttons in tab order after the message.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'MismatchBar names the sprites that cannot take a shared edit and fixes them in one click.',
  },
  example: `import { MismatchBar } from '../MismatchBar';

const EditorFooter = () => <MismatchBar />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
