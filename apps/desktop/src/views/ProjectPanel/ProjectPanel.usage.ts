/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows the open project as one tree of its folders and files, or as a list or a grid of its assets, with search tokens, filters, status marks and a menu to make a new asset, or the way to start or open a project.',
  useWhen: [
    'A dock widget lists the files of the project the owner works in.',
    'The owner wants to find, select, rename, move or open a file without a file dialog.',
  ],
  avoidWhen: [{ case: 'The owner types or picks one path on the computer.', use: 'PathInput' }],
  rules: [
    'It takes no props and reads the open project from the project store.',
    'The list refreshes when a watched folder changes and after a file is created.',
    'A click selects a row; a double click or Enter opens it, unless the setting Open assets with one click is on.',
    'A drag onto a folder moves the files with their links kept; the thumbnail of a row drags the file out to a canvas or a timeline.',
    'Search words match names and folders; tokens such as kind:sprite, is:unsaved, is:missing and uses:name become filters.',
  ],
  a11y: [
    'The tree is named Project files and the list is named Project assets; each row is a tree item with its level, position and state.',
    'Every icon button carries a label that says what it does, and a mark is never colour alone.',
  ],
  tree: {
    path: ['data', 'files, with their size, date, open and reveal'],
    rule: 'ProjectPanel is the one place the owner browses a project in the dock.',
  },
  example: `import { ProjectPanel } from '../ProjectPanel';

const ProjectWidget = () => <ProjectPanel />;
`,
  propsHash: '69a6789bb8733db8',
} satisfies ComponentUsage;

export { usage };
