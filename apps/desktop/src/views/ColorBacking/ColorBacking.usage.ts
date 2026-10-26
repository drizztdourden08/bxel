/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Puts a checkerboard behind a colour swatch whose colour is see through, so the alpha of the colour can be seen.',
  useWhen: ['A swatch shows a palette colour that has an alpha below 255.'],
  avoidWhen: [{ case: 'The swatch stands for the transparent slot.', use: 'ColorSwatch' }],
  rules: [
    'It wraps one swatch and draws the checkerboard only when the alpha is below 255.',
    'It takes the alpha as 0 to 255, the same number the palette stores.',
  ],
  a11y: ['It adds no role or label; the swatch inside keeps its own name, which holds the colour with its alpha.'],
  tree: {
    path: ['feedback', 'a note that stays on the page'],
    rule: 'ColorBacking is the checkerboard under a see through palette swatch.',
  },
  example: `import { ColorBacking } from '../ColorBacking';

const GlassSwatch = () => <ColorBacking alpha={128}>{null}</ColorBacking>;
`,
  propsHash: 'b0327413d1aeddb6',
} satisfies ComponentUsage;

export { usage };
