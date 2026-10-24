/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lists the projects the owner has used and lets the owner choose, for each one, whether an assistant may browse it, read only or with editing.',
  useWhen: [
    'A settings page decides which projects an assistant program can see.',
    'The owner wants to see which folders a grant covers.',
  ],
  avoidWhen: [{ case: 'The owner decides how a program is approved.', use: 'AssistantPanel' }],
  rules: [
    'It takes no props. The grants live in the Bxel settings, tied to the project id and its folder.',
    'A grant applies only for the same project id at the same folder, so a copied project starts off.',
    'Off removes the grant. A project that is off is invisible to every program.',
    'For the project that is open, the choice is also written to its project file so it can be shown.',
  ],
  a11y: [
    'Each select is named Let the assistant browse and the project name.',
    'The folders a grant covers are shown as plain text with their full path.',
  ],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'AssistantProjects sets the assistant access of each project.',
  },
  example: `import { AssistantProjects } from '../AssistantProjects';

const AssistantProjectsPage = () => <AssistantProjects />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
