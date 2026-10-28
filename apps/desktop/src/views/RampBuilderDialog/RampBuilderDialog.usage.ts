/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Builds a hue-shifted ramp in OKLCH from one base swatch, previews it as a strip and a shaded sphere, and adds the new swatches and the ramp in one undo step.',
  useWhen: [
    'The person chooses New ramp from the palette panel, its overflow menu or a swatch menu.',
  ],
  avoidWhen: [
    { case: 'The ramp is made from swatches already in the palette, in their order.', use: 'PalettePanel' },
    { case: 'One swatch changes colour.', use: 'ColorPicker' },
  ],
  rules: [
    'The dialog reads its request from the ramp builder store, so it takes no props; DialogHost mounts it once.',
    'Each step says new or reuses a swatch; Add ramp stays disabled while the new steps do not fit the free slots.',
    'Nothing changes the document until Add ramp; Cancel and Escape close it with the history untouched.',
  ],
  a11y: [
    'The steps are read as a list: Step 3 of 7, new, or reuses swatch 7.',
    'The base colour is a radio group of swatches named by index and hex.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'RampBuilderDialog sets the steps of a new ramp of colours in a dialog.',
  },
  example: `import { RampBuilderDialog } from '../RampBuilderDialog';

const Dialogs = () => <RampBuilderDialog />;
`,
  propsHash: '0000000000000000',
} satisfies ComponentUsage;

export { usage };
