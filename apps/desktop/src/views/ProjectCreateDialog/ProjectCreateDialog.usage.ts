/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Asks for a project name and a folder, then writes the project file there and opens the project.',
  useWhen: [
    'The owner starts a new multi-file project from the Project menu.',
    'The editor screen needs the dialog mounted once, next to the other dialogs.',
  ],
  avoidWhen: [{ case: 'A single yes or no question is enough.', use: 'Dialog' }],
  rules: [
    'It takes no props and shows only while the project store asks for it.',
    'The folder comes from the folder window of Brock, which grants it for this launch.',
    'A folder that already holds a project file is refused with a plain line.',
  ],
  a11y: [
    'The dialog traps focus and closes with Escape.',
    'Create stays off until a name and a folder are chosen.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'ProjectCreateDialog is where a project gets its name and its folder.',
  },
  example: `import { ProjectCreateDialog } from '../ProjectCreateDialog';

const EditorOverlays = () => <ProjectCreateDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
