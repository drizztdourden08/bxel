/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the items of a toolbar as a column of labelled buttons, groups and number fields, so a widget offers the same tools as the docked toolbar with their names written out.',
  useWhen: [
    'A toolbar of the editor must also be available as a widget that shows the same options with labels.',
    'The items are built once for the toolbar and the widget reads the same list.',
  ],
  avoidWhen: [
    { case: 'The items sit on an edge of the work area as a docked toolbar.', use: 'SlotToolbar' },
    { case: 'The widget has its own content, such as the layers or the palette.', use: 'LayersPanel' },
  ],
  rules: [
    'Pass the label of the toolbar and its items. The panel keeps no state, so a press runs the same handler as the toolbar button.',
    'A toggle and a choice of a group show as pressed. A group shows its name above its choices, one per line.',
    'Every control keeps its hint: the name, the description and the shortcut open at its side, and the shortcut never sits on the button.',
  ],
  a11y: [
    'The panel is a group named after the toolbar. Each button reports pressed when it is on, and each group is a group named after its label.',
  ],
  tree: {
    path: ['actions', 'several related buttons', 'tools in a row or column, with hints and options'],
    rule: 'ToolbarPanel is the expanded, labelled form of a docked toolbar of the editor.',
  },
  example: `import type { ToolbarItem } from '@drizztdourden08/tessera';
import { ToolbarPanel } from '../ToolbarPanel';

const Example = ({ items }: { items: readonly ToolbarItem[] }) => <ToolbarPanel label="Example" items={items} />;
`,
  propsHash: '664b00d315e6e0ce',
} satisfies ComponentUsage;

export { usage };
