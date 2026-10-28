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
    'Click sets colour 1, right click sets colour 2, Shift and click sets colour 3 and Shift and right click sets colour 4; keys 1 to 4 and Enter do the same on the focused swatch.',
    'Ctrl and click toggles a swatch in the selection and Ctrl, Shift and click extends it; Make ramp, Gradient between and Sort act on the selection.',
    'Dragging a swatch, or Alt and an arrow key, reorders the palette through palette.reorder, so the drawing looks the same and one undo restores it.',
    'Double click or F2 opens the colour editor; the canvas previews the draft live, Done commits it as one step and Escape drops it.',
    'The header switches between the Grid, List and Ramps views; the overflow menu holds sort, clean up, use counts and the swatch size.',
  ],
  a11y: [
    'The grid is one listbox with one Tab stop; the arrow keys, Home, End and the page keys move the focus and Shift with an arrow extends the selection.',
    'Every option is named by its index, its colour name, its hex value, the held colours that use it and its use count when use is shown.',
    'The held colours are marked by numbered corner badges of two shapes, not by colour alone.',
    'Moves, sorts and clean ups are announced in the polite live region.',
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
