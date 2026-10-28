/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Holds the options of the current tool as a docked context bar: a chip with the tool and its preset, the common options in a fixed order, the actions of the tool and a button to the Tool options panel.',
  useWhen: [
    'The user changes how the picked tool works, such as the brush size, the fill area or how a selection combines.',
    'The user applies, saves or resets a preset of the tool.',
  ],
  avoidWhen: [
    { case: 'The option applies to every tool, such as the mirror, the grids or the zoom.', use: 'CanvasToolbar' },
    { case: 'The user picks the tool.', use: 'ToolRail' },
  ],
  rules: [
    'The items come from the option model of the tool in the tool store, so the bar, the Tool options panel, the menus and the commands never drift. A tool with no options shows its chip and one line of help, so the row is never empty.',
    'The chip names the tool and the preset whose values are set, or Custom. It opens the presets of the tool, Save as preset, Reset and the Tool options panel.',
    'Each tool keeps its own values, and they survive a restart. A choice that is off says why in its hint.',
    'Place Tile and Edit Tile live on the Tools toolbar, and the collision and animation overlays live on the Canvas toolbar.',
  ],
  a11y: [
    'The toolbar is named Tool options. Arrow keys move between the items, and every change is announced once.',
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
