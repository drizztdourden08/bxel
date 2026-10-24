/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lists every sprite of the open file as a strip of thumbnails with names, and lets the user pick one or several, rename, copy, delete and reorder them.',
  useWhen: [
    'The editor docks a strip where the user chooses the sprite that drawing goes to.',
    'Several sprites are picked at once for a group edit, a shared stroke or a layout change.',
  ],
  avoidWhen: [
    { case: 'Items of a list are put in order but only one is picked.', use: 'ReorderList' },
    { case: 'A table of frames by layers shows the cels.', use: 'DataTable' },
  ],
  rules: [
    'The panel reads the active document and the sprite store, so it takes no props.',
    'A click picks one sprite, Ctrl and click adds or drops one, Shift and click picks a range.',
    'Each change is one command of the document engine, so each is one undo step.',
    'A refused command shows the reason in plain words and changes nothing.',
  ],
  a11y: [
    'The strip is a group named Sprites and each tile is one button that carries aria-pressed when picked.',
    'Left and Right move the pick, Alt with Left or Right moves the picked sprites, F2 renames, Delete removes.',
    'Each tile is named by the sprite name and its size.',
  ],
  tree: {
    path: ['data', 'a list the user reorders, with on and off icons on each row'],
    rule: 'SpritesPanel is the strip of the sprites of the open file, filled from the document and the sprite store.',
  },
  example: `import { SpritesPanel } from '../SpritesPanel';

const SpritesDock = () => <SpritesPanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
