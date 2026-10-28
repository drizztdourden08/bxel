/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The Projects page: every project Bxel knows, and a read only look inside the one picked.',
  useWhen: [
    'The Project window has no project open.',
    'The owner switches to another project.',
  ],
  avoidWhen: [{ case: 'The files of the open project.', use: 'ListDetailLayout' }],
  rules: [
    'It takes no props. The projects come from the recent list and the held projects.',
    'A closed project is read from its folder and shown in the browser with nothing editable.',
  ],
  a11y: [
    'The list is named Projects and each row names the project and whether it is open.',
  ],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'ProjectList lists the projects to open.',
  },
  example: `import { ProjectList } from '../ProjectList';

const ProjectsPage = () => <ProjectList />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
