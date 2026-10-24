/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Draws the settings rows of the Project hub that need more than one plain input: the cover, the folders and their roles, the defaults for new assets, the palette files and the assistant access.',
  useWhen: [
    'A Project settings row names a field such as project.cover or project.default.size.',
    'The owner changes how the open project is laid out or what a new asset starts with.',
  ],
  avoidWhen: [{ case: 'The row is the project name.', use: 'ConfigEmpty' }],
  rules: [
    'It takes the key of the row and draws nothing for a key it does not know.',
    'A default shows Uses the app default until the project sets it, and a button puts it back.',
    'A change is written to the project file at once.',
  ],
  a11y: ['Every input is named after the setting it changes.', 'A remove button names the folder it removes.'],
  tree: {
    path: ['a value the user sets', 'a whole record', 'edit it in place'],
    rule: 'ProjectControl edits the settings of the project that is open.',
  },
  example: `import { ProjectControl } from '../ProjectControl';

const CoverRow = () => <ProjectControl field="project.cover" />;
`,
  propsHash: 'd68e0f1fb6ce0e64',
} satisfies ComponentUsage;

export { usage };
