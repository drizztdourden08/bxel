/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks for the tag name, four or eight directions, frames per facing and mirrored facings, and scaffolds the facing tags of the open animation only when the person chooses Create.',
  useWhen: [
    'The person chooses New direction set from the Transform animation menu of the timeline or from the frame strip menu.',
    'An animation needs one tag for each facing, with some facings played as flipped copies of others.',
  ],
  avoidWhen: [
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
    { case: 'One tag on the picked frames is wanted.', use: 'IconButton' },
  ],
  rules: [
    'The dialog reads its open state from the app and takes no props; it shows nothing without an open animation.',
    'A mirrored facing names its partner, and only the west side facings can be mirrored.',
    'Create is disabled while the tag name is empty, and a count line says how many facings are drawn.',
    'Create is one undo step.',
  ],
  a11y: [
    'The dialog traps focus, closes with Escape and returns focus to the timeline.',
    'Every field sits in a labelled Field and the facing count is announced politely.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'DirectionSetDialog is the form that scaffolds the facing tags of the open animation.',
  },
  example: `import { DirectionSetDialog } from '../DirectionSetDialog';

const EditorOverlays = () => <DirectionSetDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
