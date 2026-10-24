/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Splits an older Bxel file into one file per sprite, sheet, palette, tileset and tilemap, in a new project folder or in the open project.',
  useWhen: ['The user asks to split the open older file from its bar.'],
  avoidWhen: [
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
    { case: 'A long job runs and the person may hide or cancel it.', use: 'JobDialog' },
  ],
  rules: [
    'The dialog reads the workspace store and takes no props.',
    'It lists every file it will write, and marks names that changed to fit a file name or got a number.',
    'The default destination is a new project folder beside the older file; the open project is offered when one is open.',
    'The older file is never changed, and the new project opens when the split is done.',
  ],
  a11y: [
    'The dialog traps focus and closes with Escape.',
    'The destination is a radio group with a label, and the file list is a named list.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'SplitDialog turns an older file into separate asset files.',
  },
  example: `import { SplitDialog } from '../SplitDialog';

const EditorOverlays = () => <SplitDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
