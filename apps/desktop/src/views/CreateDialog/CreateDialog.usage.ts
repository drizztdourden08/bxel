/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks for the name, size, background and palette of a new sprite or sheet of sprites, and creates it only when the person chooses Create.',
  useWhen: [
    'The person starts a new file with New, or a new sprite inside an open file with New sprite.',
    'The colour limit and the transparent slot must be set in view before anything exists.',
  ],
  avoidWhen: [
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
    { case: 'The steps of a longer task are shown one by one.', use: 'WizardDialog' },
  ],
  rules: [
    'The dialog reads its mode from the app and takes no props.',
    'The count line, the opaque used line and every error update while the person types.',
    'Create stays disabled while a field has an error, and Cancel creates nothing.',
    'The last size, colour limit, transparent slot and preset are remembered in the app settings.',
    'Inside an open file the palette is inherited and read only.',
  ],
  a11y: [
    'The dialog traps focus, closes with Escape and returns focus to the editor.',
    'Every field sits in a labelled Field and shows its error beside it.',
    'The result lines are a polite live region.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'CreateDialog is the form that creates a sprite or a sheet of sprites with the colour limit in view.',
  },
  example: `import { CreateDialog } from '../CreateDialog';

const EditorOverlays = () => <CreateDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
