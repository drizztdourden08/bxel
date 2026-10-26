/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks which sprites, which strip or which sheet to add as frames of the open animation, and adds them after the current frame only when the person chooses Add frames.',
  useWhen: [
    'The person chooses Sprites, A strip or A sheet from the Add frames from menu of the timeline or from the frame strip menu.',
    'Several frames must come from existing sprites in one undo step.',
  ],
  avoidWhen: [
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
    { case: 'One empty frame or a copy of the picked frame is wanted.', use: 'IconButton' },
  ],
  rules: [
    'The dialog reads its mode from the app and takes no props; it shows nothing without an open animation.',
    'Only sprites of the same palette as the animation are listed, and the number left out is said.',
    'A strip is added as clips of one sprite or cut into sprites of their own, and the cell count is shown before Add frames.',
    'Add frames is one undo step and selects the new frames.',
  ],
  a11y: [
    'The dialog traps focus, closes with Escape and returns focus to the timeline.',
    'Every field sits in a labelled Field or group, and the result line is announced politely.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'AddFramesDialog is the form that adds frames to the open animation from sprites, a strip or a sheet.',
  },
  example: `import { AddFramesDialog } from '../AddFramesDialog';

const EditorOverlays = () => <AddFramesDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
