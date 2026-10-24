/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Holds the New dialog, the Import wizard and the palette change preview, and takes a PNG dropped on the window to the Import wizard.',
  useWhen: [
    'The editor screen needs its dialogs mounted once.',
    'A PNG dropped on the window must start an import.',
  ],
  avoidWhen: [
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
    { case: 'The start-up question about unsaved work.', use: 'RecoveryDialog' },
  ],
  rules: [
    'The host takes no props and each dialog opens from its own store.',
    'Only PNG files are taken from a drop; other files are left alone.',
    'A drop while the Import wizard is open is ignored.',
  ],
  a11y: [
    'Each dialog traps focus, closes with Escape and returns focus to the editor.',
    'A failed read is announced in a toast.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'DialogHost is the one place the editor mounts its creation and review dialogs.',
  },
  example: `import { DialogHost } from '../DialogHost';

const EditorOverlays = () => <DialogHost />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
