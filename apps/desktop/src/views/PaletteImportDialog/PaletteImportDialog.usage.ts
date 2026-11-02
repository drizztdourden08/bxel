/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Imports colours into the palette of the open file from a palette file or pasted text, shows what would be added or replaced, and runs it as one undo step only when the person confirms.',
  useWhen: [
    'The person runs the Import colours into the palette command, or drops a palette file onto the app.',
  ],
  avoidWhen: [
    { case: 'A palette change that is previewed as rows of swatches, such as removing unused colours.', use: 'PaletteSheetDialog' },
    { case: 'One colour of a swatch changes.', use: 'ColorPicker' },
  ],
  rules: [
    'The dialog reads its request from the palette import store, so it takes no props; DialogHost mounts it once.',
    'It draws nothing unless the request names the open document and the palette bank in focus.',
    'The mode (append or replace) is picked with a segmented control, and the summary shows the colours that are present, the ones over the free slots and the plan.',
    'The confirm button stays disabled when there is nothing to do or the plan has an error.',
  ],
  a11y: [
    'The dialog traps focus, closes with Escape and returns focus. The paste box and the mode control are each named.',
    'A warning or a failure is shown in a callout in the dialog.',
  ],
  tree: {
    path: ['something over the page', 'a dialog with its own layout'],
    rule: 'PaletteImportDialog lays out its own file, paste, mode and summary parts in a dialog frame.',
  },
  example: `import { PaletteImportDialog } from '../PaletteImportDialog';

const Dialogs = () => <PaletteImportDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
