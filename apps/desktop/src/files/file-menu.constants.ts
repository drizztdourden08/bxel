/* @layer renderer-app @kind constants */
import type { MenuEntry } from '@drizztdourden08/brock-react';
import { FILE_COMMAND, FILE_TEXT } from './files.constants';

const FILE_MENU: MenuEntry[] = [
  {
    key: 'file',
    label: FILE_TEXT.group,
    icon: 'file',
    children: [
      { key: 'file-open', label: 'Open...', command: FILE_COMMAND.open },
      { key: 'file-save', label: 'Save', command: FILE_COMMAND.save },
      { key: 'file-save-as', label: 'Save as...', command: FILE_COMMAND.saveAs },
      'separator',
      { key: 'file-export', label: 'Export PNG...', command: FILE_COMMAND.export },
    ],
  },
];

export { FILE_MENU };
