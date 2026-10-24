/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Fills a settings page with a plain message and optional buttons when nothing is open to configure.',
  useWhen: [
    'The Asset hub has no asset open, so there is nothing to show.',
    'The Project hub has no project open and the owner can start or open one.',
  ],
  avoidWhen: [{ case: 'A list is empty because a filter matched nothing.', use: 'EmptyState' }],
  rules: [
    'It takes a title, a message and an optional set of buttons.',
    'The message says what to open, in one short sentence.',
  ],
  a11y: ['The title and message are plain text that a screen reader reads in order.'],
  tree: {
    path: ['feedback', 'a note that stays on the page'],
    rule: 'ConfigEmpty is the note a hub page shows when the thing it configures is not open.',
  },
  example: `import { ConfigEmpty } from '../ConfigEmpty';

const NoAssetPage = () => <ConfigEmpty title="No asset open" message="Open an asset to see its settings." />;
`,
  propsHash: '0430aad76aa5b8f1',
} satisfies ComponentUsage;

export { usage };
