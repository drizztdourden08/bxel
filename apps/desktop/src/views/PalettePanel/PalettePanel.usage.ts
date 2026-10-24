/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the palette of the open sprite as a compact colour picker, with the four colours held for drawing shown apart beside the keys that use them.',
  useWhen: [
    'The editor docks a panel where the user picks the colours to draw with from the palette of the sprite.',
    'The four held colours must be visible with the mouse and keys that draw with each one.',
  ],
  avoidWhen: [
    { case: 'A single colour is chosen from a picker, not from a fixed bank.', use: 'ColorPicker' },
    { case: 'The swatch set, the palette bank or the platform rules of the file change.', use: 'AssetControl' },
  ],
  rules: [
    'The panel reads the active document and the tool store, so it takes no props.',
    'Click sets colour 1, right click sets colour 2, Shift and click sets colour 3 and Shift and right click sets colour 4.',
    'Double click on a swatch, or a click on a held colour, opens the colour picker to change that swatch.',
    'The count line states the opaque colours, the transparent slot and the limit in the same words everywhere.',
    'Palette management lives in the Palette settings dialog opened from the header of the panel.',
  ],
  a11y: [
    'Every swatch has an accessible name with its index, its colour name, its hex value and the held colours that use it.',
    'The swatches are buttons in one group, reached with Tab and pressed with Enter or Space.',
    'The held colours are marked with their number on the swatch, not by colour alone.',
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
