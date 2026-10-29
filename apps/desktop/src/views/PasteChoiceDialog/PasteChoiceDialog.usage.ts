/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks how to paste pixels that are larger than the open sprite: crop them, grow the canvas, or make a new sprite.',
  useWhen: ['The owner pastes a clip that does not fit the sprite.', 'The owner picks Paste special with a choice.'],
  avoidWhen: [{ case: 'A message only informs and asks nothing.', use: 'Toast' }],
  rules: [
    'The dialog reads its own store, so it takes no props.',
    'Every choice closes the dialog and runs as one undo step.',
  ],
  a11y: ['The three choices and Cancel are buttons in tab order, and Escape closes the dialog.'],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'PasteChoiceDialog lets the owner choose between crop, expand and a new sprite for an oversize paste.',
  },
  example: `import { PasteChoiceDialog } from '../PasteChoiceDialog';

const Host = () => <PasteChoiceDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
