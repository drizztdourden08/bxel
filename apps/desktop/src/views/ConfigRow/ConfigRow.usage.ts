/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Gives a custom settings control its title, description and hint, read from the settings page that lists its key.',
  useWhen: [
    'A settings row draws an app control through renderControl, which Brock shows with no title.',
    'A wide editor, such as a list of folders, needs its title above it.',
  ],
  avoidWhen: [{ case: 'The row uses a built in control kind.', use: 'SettingsRow' }],
  rules: [
    'It takes the settings key and the control as children.',
    'The text comes from the item with the same key on a settings page, so it is written once.',
    'A key listed as a block draws the title above the control; any other key draws it beside the control.',
  ],
  a11y: ['The title, the description and the hint are plain text read before the control.'],
  tree: {
    path: ['layout', 'a settings screen', 'one section of rows'],
    rule: 'ConfigRow titles a custom control on a settings page.',
  },
  example: `import { ConfigRow } from '../ConfigRow';

const CoverRow = () => <ConfigRow field="project.cover">{null}</ConfigRow>;
`,
  propsHash: '0000000000000000',
} satisfies ComponentUsage;

export { usage };
