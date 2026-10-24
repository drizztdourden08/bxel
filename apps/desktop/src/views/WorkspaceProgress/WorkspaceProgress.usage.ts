/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows one progress bar while Bxel reads the asset files of a project it opens.',
  useWhen: ['A project opens and its sprites, sheets, palettes, tilesets and tilemaps are being read.'],
  avoidWhen: [
    { case: 'A long job runs in Bxel main and the person may hide or cancel it.', use: 'JobDialog' },
    { case: 'A message only informs once the work is done.', use: 'Toast' },
  ],
  rules: ['The bar reads the workspace store and takes no props.', 'It counts files read out of files found and hides when the project is open.'],
  a11y: ['The bar is a live progress bar with a label, so the count is read as it changes.'],
  tree: {
    path: ['feedback', 'progress toward an end, as a bar'],
    rule: 'WorkspaceProgress is the one progress bar of opening a project.',
  },
  example: `import { WorkspaceProgress } from '../WorkspaceProgress';

const EditorHeader = () => <WorkspaceProgress />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
