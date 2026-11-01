/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks which project folder the picked files and folders should move into.',
  useWhen: ['The owner picks Move to on one or more entries in the project browser.'],
  avoidWhen: [{ case: 'The owner drags the entries onto a folder.', use: 'The folder drop in the project browser' }],
  rules: [
    'The dialog reads its own store, so it takes no props.',
    'Picking a folder closes the dialog and moves the entries as one undoable step.',
  ],
  a11y: ['Each folder is a button in tab order, and Escape closes the dialog.'],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'MoveToDialog lets the owner choose the destination folder for a move.',
  },
  example: `import { MoveToDialog } from '../MoveToDialog';

const Host = () => <MoveToDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
