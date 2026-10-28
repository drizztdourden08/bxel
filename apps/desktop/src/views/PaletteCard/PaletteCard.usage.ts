/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Fills the stage of a palette tab with the palette itself: every swatch as a colour tile, the colour budget, and the sprites that use the palette with a button to open each one.',
  useWhen: [
    'A palette file is the open tab. The stage shows the palette instead of borrowing a sprite, so the canvas always matches the tab.',
  ],
  avoidWhen: [
    { case: 'A colour is picked to draw with beside a canvas.', use: 'PalettePanel' },
    { case: 'The palette is edited swatch by swatch.', use: 'PalettePanel' },
  ],
  rules: [
    'The card takes no props. It reads the open palette tab and lists the sprites of the open file that use it.',
    'Clicking a swatch copies its hex value. A transparent swatch copies nothing.',
    'Each user row shows a thumbnail of the sprite, its size and an Open button.',
  ],
  a11y: [
    'The card is a named region and the swatches are a named group of buttons labelled with index, name and hex.',
    'Every row opens with the keyboard.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'PaletteCard shows one palette file as a whole, with the sprites that use it.',
  },
  example: `import { PaletteCard } from '../PaletteCard';

const Stage = () => <PaletteCard />;
`,
  propsHash: 'none',
} satisfies ComponentUsage;

export { usage };
