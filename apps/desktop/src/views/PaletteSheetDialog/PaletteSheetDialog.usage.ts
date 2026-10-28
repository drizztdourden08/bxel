/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Previews a palette clean up or a gradient as rows of swatches, now and after, and runs it as one undo step only when the person confirms.',
  useWhen: [
    'The person chooses Remove unused, Unite duplicates or Gradient between in the palette panel.',
  ],
  avoidWhen: [
    { case: 'One swatch is deleted or merged with a picture of the sprite before and after.', use: 'PaletteChangeDialog' },
    { case: 'One colour of a swatch changes.', use: 'ColorPicker' },
  ],
  rules: [
    'The dialog reads its request from the palette sheet store, so it takes no props; DialogHost mounts it once.',
    'The confirm button names the count, and stays disabled when there is nothing to do or the preview fails.',
  ],
  a11y: [
    'Each row of swatches is one image named by its label and its hex values.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'PaletteSheetDialog confirms a palette change after showing what it does.',
  },
  example: `import { PaletteSheetDialog } from '../PaletteSheetDialog';

const Dialogs = () => <PaletteSheetDialog />;
`,
  propsHash: '0000000000000000',
} satisfies ComponentUsage;

export { usage };
