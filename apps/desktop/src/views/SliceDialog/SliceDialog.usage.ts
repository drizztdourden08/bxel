/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Edits one slice of the open sprite: its name, rectangle, pivot and 9-slice centre, and changes the slice only when the person chooses Apply.',
  useWhen: [
    'The person double clicks a slice with the Slice tool or chooses Slice properties for the selected slice.',
    'A slice needs an exact rectangle, a pivot on a preset or a custom point, or a 9-slice centre.',
  ],
  avoidWhen: [
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
    { case: 'The steps of a longer task are shown one by one.', use: 'WizardDialog' },
  ],
  rules: [
    'The dialog reads which slice to edit from the app and takes no props.',
    'Apply stays disabled while the name is empty or taken, the rectangle leaves the sprite, or the pivot or centre leaves the slice.',
    'Cancel changes nothing, and Apply is one undo step.',
  ],
  a11y: [
    'The dialog traps focus, closes with Escape and returns focus to the editor.',
    'Every field sits in a labelled Field, and the rectangle groups and the pivot picker have their own labels.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'SliceDialog is the form that edits the name, rectangle, pivot and 9-slice centre of one slice.',
  },
  example: `import { SliceDialog } from '../SliceDialog';

const EditorOverlays = () => <SliceDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
