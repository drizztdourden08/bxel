/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lists every project Bxel knows beside the picked one: its facts, its settings pages and its assets, with the actions to open it, rename it and make, copy and delete its assets.',
  useWhen: [
    'The Project hub needs one place to see all projects and to work on the assets of one.',
    'The owner wants to open a project, start a new one or remove one from the list.',
  ],
  avoidWhen: [{ case: 'The owner browses the files of the open project in a dock widget.', use: 'ProjectPanel' }],
  rules: [
    'It takes no props. It reads the recent and held projects and the open project from the project store.',
    'The open project is marked Open and shows its assets live. Any other project is read from the disk and is read only until it is opened.',
    'Picking an asset offers Open in Asset settings, which shows its overview, and Open to edit, which opens an editor tab.',
    'A dialog opens in the editor, so New asset and New project close the hub first.',
    'Remove from list leaves the folder and its files untouched.',
  ],
  a11y: [
    'The projects are a list named Projects and the assets are a list named Project assets.',
    'Every icon button carries a label that names the project it acts on.',
    'The chosen asset has its own group, named after the asset, with the actions as buttons.',
  ],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'ProjectManager is the one place the owner manages projects and their assets.',
  },
  example: `import { ProjectManager } from '../ProjectManager';

const ProjectsPage = () => <ProjectManager />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
