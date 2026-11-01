/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lets the person choose which tools sit on the rail and shows the keys of the tools, the held keys and the saved presets.',
  useWhen: ['The person presses Customize in the Tools panel or runs the Customize tools command.'],
  avoidWhen: [
    { case: 'The person changes one tool preference such as the hold delay.', use: 'Settings, Tools' },
    { case: 'A single yes or no question is enough.', use: 'Dialog' },
  ],
  rules: [
    'The dialog reads its open state from the app and takes no props.',
    'A tool switched off leaves the rail and waits under More tools. Its key still picks it.',
    'Keys are shown here and changed in Settings, under Keyboard.',
  ],
  a11y: ['The dialog traps focus, closes with Escape and returns focus. Each section is a labelled group.'],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'CustomizeTools is the sheet that sets up the tool rail and lists the tool keys.',
  },
  example: `import { CustomizeTools } from '../CustomizeTools';

const Overlays = () => <CustomizeTools />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
