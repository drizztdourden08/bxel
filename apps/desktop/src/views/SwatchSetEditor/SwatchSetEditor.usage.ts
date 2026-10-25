/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lets the user build, edit, import and delete swatch sets that are kept in their user data, and start a set from a platform preset or the open project.',
  useWhen: [
    'A settings page needs the library of swatch sets the user reuses in every file.',
    'A set is built colour by colour, or read from a palette file.',
  ],
  avoidWhen: [
    { case: 'The palette of one open file is edited.', use: 'PaletteFields' },
    { case: 'A single colour is set.', use: 'ColorPickerPopover' },
  ],
  rules: [
    'It takes no props. It reads and writes the swatch sets in the app settings, which Brock saves in the user data.',
    'The sets are a list beside the editor of the picked set. Each colour is its own picker, and the selected colour shows its name and Remove.',
    'A set holds 1 to 256 colours. The last colour of a set cannot be removed.',
    'Import reads GPL, PAL and palette PNG files through the same reader as the New dialog.',
    'Platform preset sets are built in and read only: copy one to change it.',
    'Copy to the open project shows only while a project is open.',
  ],
  a11y: [
    'Every control has a label that says what it sets. Each colour swatch names its place and its value and opens its picker.',
    'The list keeps the keys of ItemList; Delete asks once before a set goes.',
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
