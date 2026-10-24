/* @layer renderer-app @kind logic */
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { FILE_COMMAND, FILE_TEXT } from './files.constants';

const fileMenu = (recent: MenuItem): MenuEntry[] => [
  {
    key: 'file',
    label: FILE_TEXT.group,
    icon: 'file',
    children: [
      { key: 'file-open', label: 'Open...', command: FILE_COMMAND.open },
      recent,
      { key: 'file-save', label: 'Save', command: FILE_COMMAND.save },
      { key: 'file-save-as', label: 'Save as...', command: FILE_COMMAND.saveAs },
      'separator',
      { key: 'file-export', label: 'Export...', command: FILE_COMMAND.export },
    ],
  },
];

export { fileMenu };
