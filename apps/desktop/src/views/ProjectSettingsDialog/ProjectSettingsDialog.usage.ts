/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Lists the folders of the open project and lets the owner link another folder or unlink one.',
  useWhen: [
    'The owner wants a project to reach a second folder, such as a shared art folder.',
    'The editor screen needs the dialog mounted once, next to the other dialogs.',
  ],
  avoidWhen: [{ case: 'A single yes or no question is enough.', use: 'Dialog' }],
  rules: [
    'It takes no props and shows only while the project store asks for it and a project is open.',
    'The first folder is the project folder and cannot be removed.',
    'A new linked folder comes from the folder window of Brock, and a folder that overlaps another is refused with a plain line.',
    'Unlinking a folder takes its access away for this launch and leaves its files where they are.',
  ],
  a11y: [
    'The dialog traps focus and closes with Escape.',
    'Every remove button names the folder it removes.',
  ],
  tree: {
    path: ['something over the page', 'a question the user must answer'],
    rule: 'ProjectSettingsDialog is where a project gets or loses a linked folder.',
  },
  example: `import { ProjectSettingsDialog } from '../ProjectSettingsDialog';

const EditorOverlays = () => <ProjectSettingsDialog />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
