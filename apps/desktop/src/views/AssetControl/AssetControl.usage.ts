/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Draws the settings rows of the Asset hub that need more than one plain input: the palette of a sprite, the colour limit, the swatch set loader and the platform rules.',
  useWhen: [
    'An Asset settings row names a field such as sprite.bank or sprite.platform and the page needs the matching control.',
    'The palette or the platform of the open asset changes from the settings window.',
  ],
  avoidWhen: [
    { case: 'A swatch is deleted or merged on the palette widget.', use: 'PaletteChangeDialog' },
    { case: 'A row is a name, a number or a switch.', use: 'ConfigEmpty' },
  ],
  rules: [
    'It takes the key of the row and draws nothing for a key it does not know.',
    'Every change is one engine transaction, so one undo step undoes it.',
    'Moving a sprite to another palette opens the change dialog first and changes nothing until the owner agrees.',
  ],
  a11y: ['Every select and button is named after the setting it changes.'],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'AssetControl edits the palette and the platform of the asset that is open.',
  },
  example: `import { AssetControl } from '../AssetControl';

const PaletteRow = () => <AssetControl field="sprite.bank" />;
`,
  propsHash: 'd68e0f1fb6ce0e64',
} satisfies ComponentUsage;

export { usage };
