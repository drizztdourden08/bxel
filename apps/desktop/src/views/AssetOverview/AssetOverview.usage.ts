/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the facts and links of the file the Properties window is about: its name, kind, file, size, colours, uses and used by.',
  useWhen: [
    'The Properties window opens on a file and the owner wants its facts and links before changing a setting.',
    'The owner renames the file without going back to the editor.',
  ],
  avoidWhen: [{ case: 'The owner changes one setting of the asset, such as the pivot or the frame time.', use: 'AssetControl' }],
  rules: [
    'It takes no props. It reads the subject of the Properties window: the active tab, or the file the window is pinned to.',
    'The picture is the subject card, which also holds the pin.',
    'The name is saved when the field loses focus or Enter is pressed. A name that cannot be used shows its reason and the old name stays.',
    'A link shows the linked file. A pinned window moves its pin to it; an unpinned one opens its tab.',
  ],
  a11y: [
    'Every field and button has a label that says what it does.',
  ],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'AssetOverview is the first page of every kind in the Properties window.',
  },
  example: `import { AssetOverview } from '../AssetOverview';

const OverviewPage = () => <AssetOverview />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
