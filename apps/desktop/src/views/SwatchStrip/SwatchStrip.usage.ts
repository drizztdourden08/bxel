/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows a row of colours as one strip, as a palette preview in a menu or a ramp at full size with a caption under each step.',
  useWhen: [
    'A palette switcher shows the first colours of each palette beside its name.',
    'A ramp builder shows the steps of a new ramp with new or reused under each step.',
  ],
  avoidWhen: [
    { case: 'The person picks one of the colours with a click.', use: 'ColorSwatch' },
    { case: 'A single colour value is chosen from a picker.', use: 'ColorPicker' },
  ],
  rules: [
    'Pass the colours as hex strings; an empty string shows the transparent checker.',
    'Use size sm in menus and buttons, md in rows and lg in a dialog preview.',
    'Pass captions only at size lg, one per colour, in the same order.',
  ],
  a11y: [
    'With a label the strip is one image with that name; without one it is hidden from assistive tech, so the text beside it must name the palette.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'SwatchStrip shows a fixed row of colours the person only looks at.',
  },
  example: `import { SwatchStrip } from '../SwatchStrip';

const RampPreview = () => <SwatchStrip size="lg" colours={['#1d2b53', '#7e2553', '#ff004d']} captions={['new', 'reuses 3', 'new']} label="Ramp preview" />;
`,
  propsHash: '0000000000000000',
} satisfies ComponentUsage;

export { usage };
