/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Draws the rows of the App settings that set the defaults for new assets: size, colour limit, palette, platform, transparent slot and frame time, and the custom surround pattern row of the Surround pattern page.',
  useWhen: [
    'An App settings row names a field such as app.default.size.',
    'The owner changes what every new asset starts with.',
  ],
  avoidWhen: [{ case: 'The project sets its own default.', use: 'ProjectControl' }],
  rules: [
    'It takes the key of the row and draws nothing for a key it does not know.',
    'A change never alters an asset that exists.',
  ],
  a11y: ['Every input is named after the setting it changes.'],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'AppControl edits the defaults that every new asset starts with.',
  },
  example: `import { AppControl } from '../AppControl';

const SizeRow = () => <AppControl field="app.default.size" />;
`,
  propsHash: 'd68e0f1fb6ce0e64',
} satisfies ComponentUsage;

export { usage };
