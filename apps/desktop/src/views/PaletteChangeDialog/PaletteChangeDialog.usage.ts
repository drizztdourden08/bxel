/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows what a swatch delete, a swatch merge or a colour limit change would do to the sprites before it is applied, and applies it as one undo step.',
  useWhen: [
    'A swatch is deleted or merged and sprites may use it.',
    'The colour limit of a palette changes.',
  ],
  avoidWhen: [
    { case: 'A single swatch colour is edited with a live canvas preview.', use: 'PalettePanel' },
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
  ],
  rules: [
    'The dialog reads the proposed change from the app and takes no props.',
    'It lists the affected sprites with their frames and pixel counts, and shows one sprite before and after.',
    'Apply stays disabled until a replacement swatch is chosen and the engine accepts the change.',
    'Cancel changes nothing, and Apply is one undo step.',
  ],
  a11y: [
    'The dialog traps focus, closes with Escape and returns focus to the editor.',
    'The affected sprites are a table with column headers.',
    'The totals and the limit lines are polite live regions.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'PaletteChangeDialog is the reviewed change for swatch delete, swatch merge and limit change.',
  },
  example: `import { PaletteChangeDialog } from '../PaletteChangeDialog';

const EditorOverlays = () => <PaletteChangeDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
