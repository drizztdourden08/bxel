/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Offers to paste a sprite dropped on the canvas as a new layer of the open sprite.',
  useWhen: ['The owner drops a sprite from the project browser on the sprite canvas.'],
  avoidWhen: [{ case: 'A message only informs and asks nothing.', use: 'Toast' }],
  rules: [
    'The dialog reads its own store, so it takes no props.',
    'The choice closes the dialog and runs as one undo step.',
  ],
  a11y: ['The choice and Cancel are buttons in tab order, and Escape closes the dialog.'],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'DropLayerDialog lets the owner paste a dropped sprite as a new layer or cancel.',
  },
  example: `import { DropLayerDialog } from '../DropLayerDialog';

const Host = () => <DropLayerDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
