/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Tells the user that sprites with several frames became animations when the project opened, lists the changes on request and saves them all.',
  useWhen: ['The open project had sprites with frames and the animations made from them are not saved yet.'],
  avoidWhen: [
    { case: 'A message only informs and offers nothing.', use: 'Toast' },
    { case: 'An older file must be split before it can be edited.', use: 'LegacyBar' },
  ],
  rules: [
    'The bar reads the active workspace and takes no props.',
    'It shows while any converted animation, or the sprite it replaced, is unsaved.',
    'Show changes lists each sprite with the animation it became. Save all writes the animations and moves the old sprite files to the trash.',
  ],
  a11y: ['The bar is a status region, so the message is read when it shows.', 'Both buttons are in tab order after the message.'],
  tree: {
    path: ['feedback', 'a note that stays on the page'],
    rule: 'MigrationBar says that frames moved from sprites to animations and leads to Save all.',
  },
  example: `import { MigrationBar } from '../MigrationBar';

const EditorHeader = () => <MigrationBar />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
