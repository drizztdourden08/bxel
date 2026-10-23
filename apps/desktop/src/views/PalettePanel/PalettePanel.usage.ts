/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the palette bank of the open sprite as a grid of numbered swatches, with the count line and the front and back colours marked.',
  useWhen: [
    'The editor docks a panel where the user picks the front and back colours from the palette of the sprite.',
    'The palette size and the transparent slot must be stated beside the swatches.',
  ],
  avoidWhen: [
    { case: 'A single colour is chosen from a picker, not from a fixed bank.', use: 'ColorPicker' },
    { case: 'Items of one kind sit in equal columns with no colour meaning.', use: 'Grid' },
  ],
  rules: [
    'The panel reads the active document and the tool store, so it takes no props.',
    'Click sets the front colour, right click or Shift and click sets the back colour, and each swatch shows its index.',
    'The count line states the opaque colours, the transparent slot and the limit in the same words everywhere.',
  ],
  a11y: [
    'Every swatch has an accessible name with its index, its colour name, its hex value and its role.',
    'The swatches are buttons in one grid, reached with Tab and pressed with Enter or Space.',
    'The front and back colours are marked with a word on the swatch, not by colour alone.',
  ],
  tree: {
    path: ['a value the user sets', 'a colour', 'in the page'],
    rule: 'PalettePanel lays the colours of a fixed bank in the page for the user to pick, as numbered swatches.',
  },
  example: `import { PalettePanel } from '../PalettePanel';

const PaletteDock = () => <PalettePanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
