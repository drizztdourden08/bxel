/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Speaks short status changes to a screen reader, such as the file being saved, the tool changing or the keyboard cursor moving.',
  useWhen: ['A change happens without any focus move and a sighted user sees it at once, so a screen reader user needs it said.'],
  avoidWhen: [
    { case: 'The message is a result the user should see and dismiss.', use: 'Toast' },
    { case: 'A value changes on the control that has focus.', use: 'Text' },
  ],
  rules: [
    'Mount one Announcer in the editor screen and call announce(text) from anywhere.',
    'The same text said twice in a row is read twice.',
    'The message clears after a few seconds so a later reader does not meet a stale line.',
  ],
  a11y: ['It is a polite status region, hidden from sight and read when the user is idle.', 'It takes no focus and has no keys.'],
  tree: {
    path: ['feedback', 'a short message that passes'],
    rule: 'Announcer is the one polite live region that says status changes with no visible counterpart.',
  },
  example: `import { announce } from '../../announce/announce';

const onSaved = () => announce('Saved');
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
