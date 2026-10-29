/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Holds the numbers of an open transform session: position, size, angle, skew, pivot and the resampling method, next to the handles on the canvas.',
  useWhen: [
    'A transform session is open on a selection or on the whole cel.',
    'The owner chose Rotate or Scale and wants to type a value.',
  ],
  avoidWhen: [
    { case: 'A flip, a turn or a move waits for Apply or Cancel.', use: 'ApplyBar' },
    { case: 'A message only informs and asks nothing.', use: 'Toast' },
  ],
  rules: [
    'The bar reads the pending edit, so it takes no props.',
    'The bar shows nothing unless the pending edit is a transform.',
    'Every field edits the same session the handles edit, so the canvas preview follows at once.',
  ],
  a11y: [
    'The bar is a labelled group and every field has an accessible name.',
    'Rotate and Scale focus the field they name when the session opens.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'TransformBar edits a transform session by number while the handles edit it by hand.',
  },
  example: `import { TransformBar } from '../TransformBar';

const EditorHeader = () => <TransformBar />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
