/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Holds the options of the canvas and of the whole file as a docked toolbar: the mode, mirror, grids, rulers, tiled preview, onion skin, playback and zoom.',
  useWhen: [
    'The user switches between Sprite, Sheet and Tilemap, or turns a canvas aid on or off.',
    'A choice that applies to every tool belongs in one row that stays in place whatever tool is picked.',
  ],
  avoidWhen: [
    { case: 'The option belongs to the current tool, such as the brush size or the fill mode.', use: 'OptionsToolbar' },
    { case: 'The user picks the tool.', use: 'ToolRail' },
  ],
  rules: [
    'The toolbar reads and writes the view store, the tool store, the timeline store and the sprite store, so it takes only the slot the dock gives it.',
    'Every button has a hint with its name, one line and its key from the keymap. The key never sits on the button.',
    'Back to sheet and Paint all selected appear only when they apply. The other items stay and turn off when no file is open, so the row keeps its shape.',
    'The same items are offered with labels in the Canvas widget, from the same list.',
  ],
  a11y: [
    'The toolbar is named Canvas. Arrow keys move between the items, and the first stop is the handle that moves the toolbar to another side.',
  ],
  tree: {
    path: ['actions', 'several related buttons', 'tools in a row or column, with hints and options'],
    rule: 'CanvasToolbar is the docked toolbar of the canvas and view options of the editor.',
  },
  example: `import type { ToolbarSlot } from '@drizztdourden08/tessera';
import { CanvasToolbar } from '../CanvasToolbar';

const Example = ({ slot }: { slot: ToolbarSlot }) => <CanvasToolbar slot={slot} />;
`,
  propsHash: 'f077f75daf06e6f9',
} satisfies ComponentUsage;

export { usage };
