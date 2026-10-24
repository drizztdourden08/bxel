/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Manages the sprites of the open file and its sheets: a grid or list of thumbnails to search, sort, filter, pick, rename, copy, delete, reorder, place on a sheet and change in batches, and an atlas preview of the packed sheet.',
  useWhen: [
    'The editor docks the sheet manager beside the layers, where the user chooses the sprite that drawing goes to.',
    'Several sprites are picked at once for a group edit, a shared stroke, a layout change or a batch rename.',
  ],
  avoidWhen: [
    { case: 'The user picks and orders the layers of one sprite instead of the sprites of a file.', use: 'LayersPanel' },
    { case: 'A table of frames by layers shows the cels.', use: 'DataTable' },
  ],
  rules: [
    'The panel reads the active document and the sprite store, so it takes no props.',
    'A click picks one sprite, Ctrl and click adds or drops one, Shift and click picks a range in the order shown, and a drag over empty space picks the sprites it touches.',
    'Each change is one command of the document engine, so each is one undo step, and a batch over many sprites is still one step.',
    'A refused command shows the reason in plain words and changes nothing.',
    'The search, sort, filters, view and zoom only change what is shown; they never change the file.',
  ],
  a11y: [
    'The thumbnails are a group named Sprites and each tile or row is one button that carries aria-pressed when picked.',
    'Arrow keys move the pick, Home and End jump, Space toggles, Enter isolates, Ctrl and A picks all, Left and Right with Alt move the picked sprites, F2 renames, Delete removes.',
    'Each tile is named by the sprite name and its size, and the sortable list headers carry aria-sort.',
  ],
  tree: {
    path: ['data', 'a list the user reorders, with on and off icons on each row'],
    rule: 'SpritesPanel is the sheet manager of the open file, filled from the document and the sprite store.',
  },
  example: `import { SpritesPanel } from '../SpritesPanel';

const SheetDock = () => <SpritesPanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
