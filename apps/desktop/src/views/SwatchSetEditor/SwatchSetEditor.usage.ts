/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lets the user build, edit, import and delete swatch sets that are kept in their user data, and start a set from a platform preset or the open project.',
  useWhen: [
    'A settings page needs the library of swatch sets the user reuses in every file.',
    'A set is built color by color, or read from a palette file.',
  ],
  avoidWhen: [
    { case: 'The palette of one open file is edited.', use: 'PaletteFields' },
    { case: 'A single color is set.', use: 'ColorPickerPopover' },
  ],
  rules: [
    'It takes no props. It reads and writes the swatch sets in the app settings, which Brock saves in the user data.',
    'A set holds 1 to 256 colors. The last color of a set cannot be removed.',
    'Import reads GPL, PAL and palette PNG files through the same reader as the New dialog.',
    'Platform preset sets are built in and read only: copy one to change it.',
    'Copy to the open project shows only while a project is open.',
  ],
  a11y: [
    'Every control has a label that says what it sets. Each color swatch names its place and its value.',
    'Delete needs a second press and says so when armed.',
  ],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'SwatchSetEditor edits the library of reusable swatch sets.',
  },
  example: `import { SwatchSetEditor } from '../SwatchSetEditor';

const SwatchSetsPage = () => <SwatchSetEditor />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
