/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Collects what to write, for which sprites, layers and frames, at what scale and colour, and where, then starts a background export of a fixed revision.',
  useWhen: [
    'The person wants images, an animation or a sheet with its JSON written to a folder.',
    'The person needs to see the file names, the output size and any colour or alpha limit before anything is written.',
  ],
  avoidWhen: [
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
    { case: 'A long job runs and the person may hide or cancel it.', use: 'JobDialog' },
  ],
  rules: [
    'The dialog reads the open file from the document store and takes no props.',
    'The export runs as a Brock job against the revision that was current when Export was pressed, so editing can go on.',
    'Indexed PNG is offered only when the exact colours fit in 256 entries, and a combined palette needs approval first.',
    'Every file is written without joining the recent list.',
    'Presets are kept in the app settings until the document model has export preset commands.',
  ],
  a11y: [
    'Every field has a visible label and a name, and each choice is a segmented control that moves with the arrow keys.',
    'Escape closes the dialog, and Enter in the file name starts the export when nothing blocks it.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'ExportDialog is the one place where the person decides what is written to disk and in which shape.',
  },
  example: `import { ExportDialog } from '../ExportDialog';

const EditorOverlays = () => <ExportDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
