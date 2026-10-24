/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lists the layers of the open sprite, top layer first, and lets the user pick, show, lock, rename, add, copy, merge, flatten, delete and reorder them.',
  useWhen: [
    'The editor docks a panel where the user chooses the layer that drawing goes to.',
    'Layers must be shown or locked from the row and put in order by drag or by keys.',
  ],
  avoidWhen: [
    { case: 'The user picks and orders the sprites of a file instead of the layers of one sprite.', use: 'SpritesPanel' },
    { case: 'A table of frames by layers shows the cels.', use: 'DataTable' },
  ],
  rules: [
    'The panel reads the active document and the tool store, so it takes no props.',
    'The picked row is the active layer; drawing, filling and layer commands act on it.',
    'Each change is one command of the document engine, so each is one undo step.',
    'A refused command shows the reason in plain words and changes nothing.',
  ],
  a11y: [
    'The list is named Layers and each row is one button that carries aria-pressed when picked.',
    'Alt and Up or Down moves the focused row, and F2 renames the picked layer.',
    'Visible and Locked are icon buttons named by what they do, in a group named after the layer.',
  ],
  tree: {
    path: ['data', 'a list the user reorders, with on and off icons on each row'],
    rule: 'LayersPanel is the list of the layers of the open sprite, filled from the document and the tools.',
  },
  example: `import { LayersPanel } from '../LayersPanel';

const LayersDock = () => <LayersPanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
