/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Brings a PNG image in without ever exceeding the palette limit, showing the original beside the palette-mapped result before anything changes.',
  useWhen: [
    'The person chooses Import image, or drops a PNG on the window.',
    'A sprite sheet must be cut into sprites with a grid and named in order.',
  ],
  avoidWhen: [
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
    { case: 'A long job runs and the person may hide or cancel it.', use: 'JobDialog' },
  ],
  rules: [
    'The wizard reads the image from the app and takes no props.',
    'Steps are Source, Colors and, for a sheet, Slicing. Cancel at any step changes nothing.',
    'Next stays disabled while the image has more colors than the limit and no reduction is chosen.',
    'The import is one transaction, so one undo removes every sprite it made.',
  ],
  a11y: [
    'The dialog traps focus, closes with Escape and returns focus to the editor.',
    'The result lines and the sprite count are polite live regions.',
    'Both previews are labelled application regions with the same zoom and pan.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'ImportWizard is the stepped dialog that reduces the colors of a PNG to a palette and slices it into sprites.',
  },
  example: `import { ImportWizard } from '../ImportWizard';

const EditorOverlays = () => <ImportWizard />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
