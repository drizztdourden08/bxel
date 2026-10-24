/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the open project as a list of its assets, with filters, sort and search, or as its folders, with a menu to make a new asset, or the way to start or open a project.',
  useWhen: [
    'A dock widget lists the files of the project the owner works in.',
    'The owner wants to open or create a file without a file dialog.',
  ],
  avoidWhen: [{ case: 'The owner types or picks one path on the computer.', use: 'PathInput' }],
  rules: [
    'It takes no props and reads the open project from the project store.',
    'The list refreshes when the window gets focus and after a file is created.',
    'A click on an asset opens its tab; in the Folders view a double click opens a file and a click on a folder goes into it.',
    'Names that break the file name rules are not listed and are counted in a line.',
  ],
  a11y: [
    'The Folders list is named Project files and the Assets list is named Project assets; each file is a list item.',
    'Every icon button carries a label that says what it does.',
  ],
  tree: {
    path: ['data', 'files, with their size, date, open and reveal'],
    rule: 'ProjectPanel is the one place the owner browses a project.',
  },
  example: `import { ProjectPanel } from '../ProjectPanel';

const ProjectWidget = () => <ProjectPanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
