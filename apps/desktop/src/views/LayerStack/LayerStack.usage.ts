/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lists the layers of what the editor shows, top layer first: a sprite, a tile, an animation frame, a tilemap, or the layer names of a sheet. It picks, shows, locks, tags, renames, reorders, adds, copies, merges and deletes them.',
  useWhen: [
    'The editor docks a panel where the user chooses the layer that drawing goes to and sees what is on each layer.',
    'Layers must be shown, hidden or locked from the row, many at once by dragging down the eye or lock column, and put in order by drag or by keys.',
  ],
  avoidWhen: [
    { case: 'The user picks and orders the sprites of a file instead of the layers of one sprite.', use: 'SpritesPanel' },
    { case: 'A table of frames by layers shows the cels.', use: 'DataTable' },
  ],
  rules: [
    'The view reads the active document and the stores, so it takes no props.',
    'One list serves sprites and tilemaps; the owner line above it says what the layers belong to.',
    'The active row is the drawing target; many rows can be picked, and a command acts on all picked rows.',
    'Each change is one command of the document engine, so each is one undo step, and a sweep over many rows is one step too.',
    'A refused command shows the reason in plain words and changes nothing.',
    'A thumbnail draws again only when the pixels of its own layer change, and no more than about twelve times a second.',
  ],
  a11y: [
    'The list is named Layers and each row is one button that carries aria-pressed when picked and aria-current when active.',
    'Alt and Up or Down moves the focused row, Shift and Up or Down extends the pick, F2 renames in the row.',
    'Visible and Locked are icon buttons named by what they do, in a group named after the layer, and each has a key and a menu entry.',
    'A colour tag is never the only signal: the row says the colour name to a screen reader.',
  ],
  tree: {
    path: ['data', 'a list the user reorders, with on and off icons on each row'],
    rule: 'LayerStack is the list of the layers of what is open, filled from the document and the tools.',
  },
  example: `import { LayerStack } from '../LayerStack';

const LayersDock = () => <LayerStack />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
