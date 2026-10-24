/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Tells the user that the open older Bxel file holds several assets, opens read only, and offers to split it into separate files.',
  useWhen: ['An older .bxel file with more than one sprite, or with sheets or tilemaps, is the active document.'],
  avoidWhen: [
    { case: 'A message only informs and offers nothing.', use: 'Toast' },
    { case: 'A shared edit cannot apply to every picked sprite.', use: 'MismatchBar' },
  ],
  rules: [
    'The bar reads the active workspace and takes no props.',
    'It counts the sprites, sheets and palettes of the file and names them in one sentence.',
    'The button opens the Split dialog; the older file is never changed.',
  ],
  a11y: ['The bar is a status region, so the message is read when it shows.', 'The split button is in tab order after the message.'],
  tree: {
    path: ['feedback', 'a note that stays on the page'],
    rule: 'LegacyBar explains why an older file is read only and leads to the Split dialog.',
  },
  example: `import { LegacyBar } from '../LegacyBar';

const EditorHeader = () => <LegacyBar />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
