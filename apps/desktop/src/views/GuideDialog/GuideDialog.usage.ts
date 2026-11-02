/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks for the exact position of one guide on the open canvas, adds a new guide or moves an existing one when the person chooses Apply, and can remove the guide it edits.',
  useWhen: [
    'The person double clicks a guide on the canvas, chooses Edit a guide position, or adds a guide from the View panel.',
    'A guide must sit on an exact pixel or half pixel that dragging cannot hit easily.',
  ],
  avoidWhen: [
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
    { case: 'A guide only needs a quick drag from the ruler.', use: 'the ruler' },
  ],
  rules: [
    'The dialog reads its open state from the app and takes no props.',
    'The position starts at the guide being edited, or at the clicked place for a new guide.',
    'Apply stays disabled while the position is outside the canvas, and Cancel changes nothing.',
    'Apply and Remove are each one undo step.',
  ],
  a11y: [
    'The dialog traps focus, closes with Escape and returns focus to the editor.',
    'Every field sits in a labelled Field.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'GuideDialog is the form that sets the exact position of one canvas guide.',
  },
  example: `import { GuideDialog } from '../GuideDialog';

const EditorOverlays = () => <GuideDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
