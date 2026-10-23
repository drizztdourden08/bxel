/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks at start whether to restore, discard or postpone the unsaved work that an earlier session left behind.',
  useWhen: [
    'The app starts and recovery copies of unsaved projects exist from the last session.',
    'The person must choose between restoring the copy, discarding it and deciding later.',
  ],
  avoidWhen: [
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
    { case: 'A long job runs and the person may hide or cancel it.', use: 'JobDialog' },
  ],
  rules: [
    'The dialog reads the recovery copies from Brock and takes no props.',
    'It shows one copy at a time and names the file and when the copy was kept.',
    'Restore opens the copy as an unsaved document, then removes the copy; Discard removes it; Decide later keeps it for the next start.',
    'A copy that cannot be restored stays and the dialog moves on to the next one.',
  ],
  a11y: [
    'The dialog traps focus, closes with Escape as Decide later and returns focus to the editor.',
    'Every choice is a labelled button, and the danger variant marks Discard.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'RecoveryDialog is the start-up question about unsaved work left by an earlier session.',
  },
  example: `import { RecoveryDialog } from '../RecoveryDialog';

const EditorOverlays = () => <RecoveryDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
