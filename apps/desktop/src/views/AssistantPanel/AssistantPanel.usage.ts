/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lets the owner decide how assistant programs are approved, see who is connected, forget remembered programs and copy the MCP client config.',
  useWhen: [
    'A settings page manages the programs that reach Bxel through its MCP helper.',
    'The owner wants to disconnect a program or make it read only.',
  ],
  avoidWhen: [{ case: 'A plain on or off switch for assistant access is shown.', use: 'SettingsRow' }],
  rules: [
    'It takes no props. It reads and writes the assistant settings, which Brock saves in the user data.',
    'Choosing Allow all asks for a confirm that shows the risk warning; Cancel keeps the earlier level.',
    'Forget and Forget all also disconnect the live sessions of those programs.',
    'The activity list keeps the last calls in memory only.',
  ],
  a11y: [
    'Every control has a label that names what it sets.',
    'Disconnect and Forget name the program in the row they act on.',
  ],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'AssistantPanel edits the approval level and the list of remembered programs.',
  },
  example: `import { AssistantPanel } from '../AssistantPanel';

const AssistantProgramsPage = () => <AssistantPanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
