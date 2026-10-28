/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The subject of the Properties window: the file it is about, its kind and path, its badges, its preview, and the pin that holds it.',
  useWhen: [
    'The Properties window opens beside the rows of one file.',
  ],
  avoidWhen: [{ case: 'A free standing preview of a file.', use: 'ItemCard' }],
  rules: [
    'It takes no props. It reads the subject: the active tab, or the file the window is pinned to.',
    'Unpinned it follows the selected tab. Pinned it stays on one file through tab changes and a restart.',
    'A pinned file that is gone shows Missing with a button to unpin.',
  ],
  a11y: [
    'The card is a region named after the file. The pin is a toggle button that reports whether it is pressed.',
  ],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'SubjectCard names the file a Properties page is about.',
  },
  example: `import { SubjectCard } from '../SubjectCard';

const Beside = () => <SubjectCard />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
