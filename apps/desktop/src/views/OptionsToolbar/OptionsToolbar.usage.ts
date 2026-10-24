/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Holds the options of the current tool as a docked toolbar: brush size and shape, pixel perfect, fill area and neighbours, shape kind and filled, selection shape and mode, and the tilemap place and edit switch.',
  useWhen: [
    'The user changes how the picked tool works, such as the brush size, the fill area or how a selection combines.',
    'In Tilemap mode the user switches between placing tiles and editing the pixels of one tile.',
  ],
  avoidWhen: [
    { case: 'The option applies to every tool, such as the mirror, the grids or the zoom.', use: 'CanvasToolbar' },
    { case: 'The user picks the tool.', use: 'ToolRail' },
  ],
  rules: [
    'The items follow the tool in the tool store. A tool with no options leaves the toolbar with its handle only, so the row never changes height.',
    'In tile placing mode the items are the tile turn buttons, the filled switch and the cell actions; the state of the turn and of the selection shows in the scope bar.',
    'Every item has a hint with its name, one line and its key. A choice that is off says why in its hint.',
    'The same items are offered with labels in the Tool options widget, from the same list.',
  ],
  a11y: [
    'The toolbar is named Tool options. Arrow keys move between the items, and the number field of the brush size takes the arrow keys itself.',
  ],
  tree: {
    path: ['actions', 'several related buttons', 'tools in a row or column, with hints and options'],
    rule: 'OptionsToolbar is the docked toolbar of the options of the picked tool.',
  },
  example: `import type { ToolbarSlot } from '@drizztdourden08/tessera';
import { OptionsToolbar } from '../OptionsToolbar';

const Example = ({ slot }: { slot: ToolbarSlot }) => <OptionsToolbar slot={slot} />;
`,
  propsHash: 'f077f75daf06e6f9',
} satisfies ComponentUsage;

export { usage };
