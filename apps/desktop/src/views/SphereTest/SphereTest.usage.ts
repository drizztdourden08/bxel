/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shades a 16 pixel sphere with the steps of a ramp, lit from the top left, so a person sees at a glance whether the ramp reads as light and shadow.',
  useWhen: [
    'A ramp builder previews the ramp it is about to add.',
    'A ramps view shows how each ramp of the palette shades a round form.',
  ],
  avoidWhen: [
    { case: 'The colours of the ramp are shown as a row.', use: 'SwatchStrip' },
    { case: 'A finished image is compared before and after.', use: 'ImagePreview' },
  ],
  rules: [
    'Pass the ramp colours from dark to light; the darkest step shades the lower right rim.',
    'The sphere is drawn at 16 by 16 pixels and scaled without smoothing.',
  ],
  a11y: [
    'The sphere is one image named by label, such as Shaded sphere test of Moss.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'SphereTest shows a small pixel drawing the person only looks at.',
  },
  example: `import { SphereTest } from '../SphereTest';

const Preview = () => <SphereTest colours={['#1d2b53', '#7e2553', '#ff004d', '#ffa300']} label="Shaded sphere test" />;
`,
  propsHash: '0000000000000000',
} satisfies ComponentUsage;

export { usage };
