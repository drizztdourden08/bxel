/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Draws the icon of a tool member as the Tools toolbar and the Tool options chip show it, with a corner mark for a slot that holds variants, a dot for a slot with options and a small badge for hidden state.',
  useWhen: [
    'A toolbar button stands for a slot of tools and must show which variant it holds and any state that changes the result.',
    'The icon of a tool is needed outside the rail, such as on the chip of the Tool options bar.',
  ],
  avoidWhen: [
    { case: 'A button only needs a plain icon.', use: 'IconButton' },
    { case: 'A count or a dot for news sits beside text.', use: 'Status' },
  ],
  rules: [
    'It draws only the icon and its marks and holds no state; the rail and the chip give it the member and the badge.',
    'The corner mark and the dot sit at the bottom right, the badge at the top right. All three are hidden from screen readers, so the text of the badge also goes into the description of the button.',
    'A filled shape swaps to the filled icon of the member when it has one.',
  ],
  a11y: ['The marks carry no meaning alone: the button name and description say the variant and the state in words.'],
  tree: {
    path: ['a status, a count or a label', 'a count, or a dot for news'],
    rule: 'SlotIcon is the tool icon with the marks that tell variants and state.',
  },
  example: `import { SlotIcon } from '../SlotIcon';
import type { ToolMember } from '../../editor/tool-catalogue/tool-catalogue.type';

const Example = ({ member }: { member: ToolMember }) => <SlotIcon member={member} filled={false} mark="corner" badge={null} />;
`,
  propsHash: 'd04feda33f258a8e',
} satisfies ComponentUsage;

export { usage };
