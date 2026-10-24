/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks for the new width, height and anchor of the open sprite, shows how many pixels the change would cut off, and resizes the canvas only when the person chooses Apply.',
  useWhen: [
    'The person chooses Canvas size from the Transform menu of the canvas toolbar or uses its shortcut.',
    'The canvas must grow or shrink around an anchor while the pixels keep their place.',
  ],
  avoidWhen: [
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
    { case: 'The steps of a longer task are shown one by one.', use: 'WizardDialog' },
  ],
  rules: [
    'The dialog reads its open state from the app and takes no props.',
    'The sizes start at the size of the open sprite and the anchor starts in the centre.',
    'Apply stays disabled while a side is outside the allowed range, and Cancel changes nothing.',
    'Apply is one undo step.',
  ],
  a11y: [
    'The dialog traps focus, closes with Escape and returns focus to the editor.',
    'Every field sits in a labelled Field, and the anchor picker has its own label.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'CanvasSizeDialog is the form that sets the canvas size of the open sprite with an anchor.',
  },
  example: `import { CanvasSizeDialog } from '../CanvasSizeDialog';

const EditorOverlays = () => <CanvasSizeDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
