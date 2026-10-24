/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Sets where a palette comes from, how many slots it holds and whether slot 0 is transparent, with the limit presets and a custom value always in view.',
  useWhen: [
    'A new file or an import creates a palette and the color limit must be set in view.',
    'The same fields are needed in more than one dialog.',
  ],
  avoidWhen: [
    { case: 'A single swatch color is edited.', use: 'ColorPickerPopover' },
    { case: 'Only one choice from a list is needed.', use: 'Select' },
  ],
  rules: [
    'Pass the source, the limit and the transparent flag as one value, and receive the changed fields in onChange.',
    'The limit presets are 4, 8, 16, 32, 64 and 256, and a custom value is 1 to 256.',
    'Set withSource to offer the preset, custom and palette file sources.',
    'Pass the limit error and the palette error so each sits beside its field.',
  ],
  a11y: [
    'Every control sits in a labelled Field and shows its error beside it.',
    'The limit presets are a labelled segmented control and the custom value has its own label.',
  ],
  tree: {
    path: ['a value the user sets', 'one choice', 'a few, all in view'],
    rule: 'PaletteFields groups the source, limit and transparent slot of a palette the dialogs create.',
  },
  example: `import { PaletteFields } from '../PaletteFields';
import type { ComponentProps } from 'react';

const Fields = (props: ComponentProps<typeof PaletteFields>) => <PaletteFields {...props} />;
`,
  propsHash: 'fb063fd329c1a2a9',
} satisfies ComponentUsage;

export { usage };
