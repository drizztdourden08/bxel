/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The header of the Properties window: the file it is about, its kind, its path and badges, with the pin and the file actions on the right.',
  useWhen: [
    'The Properties window draws its hub header.',
  ],
  avoidWhen: [{ case: 'A free standing preview of a file.', use: 'ItemCard' }],
  rules: [
    'It takes no props. It reads the subject: the active tab, or the file the window is pinned to.',
    'Every page of the window shows it, so every page names its file.',
    'Unpinned it says it follows the selected tab. Pinned it says so and the toggle unpins.',
  ],
  a11y: [
    'The pin is a toggle button that reports whether it is pressed.',
  ],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'SubjectHeader names the file a Properties page is about.',
  },
  example: `import { SubjectHeader } from '../SubjectHeader';

const Header = () => <SubjectHeader />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
