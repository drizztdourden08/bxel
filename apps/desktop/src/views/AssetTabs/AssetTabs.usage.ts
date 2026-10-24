/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows one tab per open asset above the canvas: sprites, sheets, palettes, tilesets and tilemaps of every open workspace.',
  useWhen: [
    'Several assets of a project or of loose files are open and the user switches between them.',
    'The user closes an asset from its tab or puts the tabs in order.',
  ],
  avoidWhen: [
    { case: 'The list of every asset in the project is wanted.', use: 'ProjectPanel' },
    { case: 'The sprites of the open sheet are wanted.', use: 'SpritesPanel' },
  ],
  rules: [
    'The strip reads the workspace store and takes no props.',
    'A tab shows a dot while its asset has unsaved changes, and its hover text is the file of the asset.',
    'Closing the last tab of a loose workspace closes it and asks first about unsaved assets; a project stays open.',
  ],
  a11y: [
    'The strip is the tab list of the shell, named Open assets, with keys to move, close and reorder tabs.',
    'An unsaved asset says so to screen readers.',
  ],
  tree: {
    path: ['navigation', 'between the open documents of an editor'],
    rule: 'AssetTabs is the strip of open assets above the canvas.',
  },
  example: `import { AssetTabs } from '../AssetTabs';

const EditorHeader = () => <AssetTabs />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
