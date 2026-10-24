/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows a dialog that never grows taller than the window: the body scrolls while the title and the buttons stay in view.',
  useWhen: [
    'A dialog holds several fields, a preview or a list that can grow with the content.',
    'The window can be small, so a tall dialog would push its buttons out of reach.',
  ],
  avoidWhen: [
    { case: 'A dialog has one line of text and two buttons.', use: 'Dialog' },
    { case: 'The steps of a longer task are shown one by one.', use: 'WizardDialog' },
  ],
  rules: [
    'It takes the props of DialogShell and passes them on.',
    'The body scrolls on its own, so a child does not need its own height cap or scrollbar.',
    'Keep the title and the buttons in the title and actions props, never in the children.',
  ],
  a11y: [
    'The dialog keeps the focus, Escape and title naming of DialogShell.',
    'The scrolling body is reached with the keyboard through the controls inside it.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'FitDialog is the dialog for a form that can be taller than the window.',
  },
  example: `import { FitDialog } from '../FitDialog';

const Rename = ({ onClose }: { onClose: () => void }) => (
  <FitDialog open title="Rename" onClose={onClose}>
    <input aria-label="Name" />
  </FitDialog>
);
`,
  propsHash: '83152775e3414750',
} satisfies ComponentUsage;

export { usage };
