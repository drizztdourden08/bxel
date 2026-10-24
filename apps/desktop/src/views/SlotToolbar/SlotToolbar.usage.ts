/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Draws the items of one docked toolbar in the Tessera Toolbar, in the orientation and with the drag handle that the toolbar dock hands to it.',
  useWhen: [
    'A toolbar file in src/toolbars renders its items for the slot the dock gives it.',
    'A new toolbar of the editor needs the handle, the hints and the fold into More without writing them again.',
  ],
  avoidWhen: [
    { case: 'The same items are shown with labels in a widget.', use: 'Toolbar' },
    { case: 'The items belong to one row of one list item.', use: 'ActionBar' },
  ],
  rules: [
    'Pass the items the toolbar owns and the slot from the dock. The view adds the label, the orientation and the drag handle.',
    'Keep every value in the items. The view holds no state and no layout of its own, so the dock decides the side and the length.',
  ],
  a11y: [
    'The toolbar has role toolbar, a name from its label and the orientation of its side. The handle is the first stop and can move the toolbar with the keyboard.',
  ],
  tree: {
    path: ['actions', 'several related buttons', 'tools in a row or column, with hints and options'],
    rule: 'SlotToolbar is the Toolbar of one docked toolbar of the editor.',
  },
  example: `import type { ToolbarItem, ToolbarSlot } from '@drizztdourden08/tessera';
import { SlotToolbar } from '../SlotToolbar';

const Example = ({ items, slot }: { items: readonly ToolbarItem[]; slot: ToolbarSlot }) => (
  <SlotToolbar label="Example" items={items} slot={slot} />
);
`,
  propsHash: '72c1fa67d3ca29d6',
} satisfies ComponentUsage;

export { usage };
