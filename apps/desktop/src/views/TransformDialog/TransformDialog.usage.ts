/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks for the angle of a rotation or the size of a scale, and the bounds policy, while the canvas previews the result live.',
  useWhen: [
    'Rotate or Scale needs typed values before its Apply bar can make sense.',
    'The user must choose between crop, expand canvas and cancel when the result does not fit.',
  ],
  avoidWhen: [
    { case: 'The edit has no values, such as a flip or a quarter turn.', use: 'ApplyBar' },
    { case: 'The user only needs to confirm a preview.', use: 'ApplyBar' },
  ],
  rules: [
    'The dialog reads the pending edit from the pending store and opens only for a rotate or scale that is being edited.',
    'Every change of a field runs the engine preview again, so the canvas and the commit match.',
    'Preview on canvas closes the dialog and leaves the Apply bar. Cancel and Escape discard the edit.',
  ],
  a11y: [
    'Every field has a visible label and a name, and the bounds choice is a segmented control that moves with the arrow keys.',
    'Escape closes the dialog and cancels the edit.',
  ],
  tree: {
    path: ['layout', 'an app frame with its navigation'],
    rule: 'TransformDialog is the dialog that collects the numbers of a rotate or scale before the Apply bar.',
  },
  example: `import { TransformDialog } from '../TransformDialog';

const EditorDialogs = () => <TransformDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
