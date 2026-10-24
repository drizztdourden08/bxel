/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows a Palette settings button that opens one dialog to choose the palette bank, load a swatch set and set the platform rules of the open file.',
  useWhen: [
    'The palette widget needs a way to manage the palette of the open file without crowding the colour picker.',
    'Swatch sets, the platform preset, strict rules and the snap to the platform grid must be reached from one place.',
  ],
  avoidWhen: [
    { case: 'The user only picks the colours to draw with.', use: 'PalettePanel' },
    { case: 'A swatch is deleted, merged or the colour limit changes.', use: 'PaletteChangeDialog' },
  ],
  rules: [
    'The button sits in the header of the palette widget and takes no props.',
    'The dialog reads the active document, so each change is one command and one undo step.',
    'A refused change shows the reason in plain words and changes nothing.',
  ],
  a11y: [
    'The button names the dialog it opens and carries aria-haspopup.',
    'The dialog closes with Escape or with the Close button and returns focus to the button.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'PaletteSettings is the button and the dialog that hold every palette setting that is not picking a colour.',
  },
  example: `import { PaletteSettings } from '../PaletteSettings';

const PaletteHeader = () => <PaletteSettings />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
