/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Holds the tools of the editor as a docked toolbar of pixel art icon buttons grouped in slots, with the active tool lit, a corner mark on the slots that hold variants and a menu that opens on a hold, a right click or the arrow key.',
  useWhen: [
    'The editor needs one place to pick the tool, such as the pencil, the eraser, the fill, the picker, the shapes, the zoom or the hand.',
    'Each tool has a single key and the rail must teach it in a hint, never on the button.',
  ],
  avoidWhen: [
    { case: 'Tools sit in labelled groups on a top bar.', use: 'ToolGroups' },
    { case: 'A few related actions share one horizontal row.', use: 'ButtonGroup' },
  ],
  rules: [
    'The rail reads and writes the tool in the tool store, so it takes only the slot the toolbar dock gives it. It starts on the left side and can move to any side.',
    'The slots come from the tool catalogue for the open asset: a sprite and a tile show the drawing tools, a map shows Place, Erase, Fill, Pick, Rectangle and Select, a sheet shows Zoom and Hand, and with no asset open every tool is dimmed. A tool that cannot apply is hidden, not greyed.',
    'A slot that holds variants, such as Shapes or Select, shows the icon of the last variant and a corner mark. A slot with options but one variant shows a dot. A badge says hidden state that changes the result: Global fill, Filled and the Add, Subtract or Intersect selection mode.',
    'A click picks the slot and opens nothing. A held press, a right click, Shift+F10 and the arrow key that points away from the bar open the tool menu: variants, options, presets, reset and the Tools panel. With Open tool menus on hover on, the pointer opens it too.',
    'Pressing the key of the active slot again cycles its variants and Shift with the key cycles back. Each change is announced and shown for a moment in the status bar.',
    'In a tilemap the first button switches between Place Tile and Edit Tile.',
  ],
  a11y: [
    'The rail is a toolbar named Tools whose buttons report pressed, each with an accessible name that holds the slot and its variant, such as Shapes, Ellipse.',
    'The buttons are reached with Tab and pressed with Enter or Space; the tool keys work from anywhere in the editor. The menu is a Brock context menu with the keyboard of a menu.',
  ],
  tree: {
    path: ['actions', 'several related buttons', 'peer actions on one thing, read as one tool'],
    rule: 'ToolRail is the vertical group of tool buttons of the editor, bound to the tool store.',
  },
  example: `import type { ToolbarSlot } from '@drizztdourden08/tessera';
import { ToolRail } from '../ToolRail';

const EditorSide = ({ slot }: { slot: ToolbarSlot }) => <ToolRail slot={slot} />;
`,
  propsHash: 'f077f75daf06e6f9',
} satisfies ComponentUsage;

export { usage };
