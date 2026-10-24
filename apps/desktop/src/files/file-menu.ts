/* @layer renderer-app @kind logic */
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { ASSET_SETTINGS_COMMAND } from '../config-entry/config-entry.constants';
import { DIALOG_COMMAND } from '../keymap/dialog-command-id.constants';
import { TILED_COMMAND } from '../keymap/tiled-command-id.constants';
import { FILE_COMMAND, FILE_TEXT } from './files.constants';

const fileMenu = (recent: MenuItem, settingsLabel: string): MenuEntry[] => [
  {
    key: 'file',
    label: FILE_TEXT.group,
    icon: 'file',
    children: [
      { key: 'file-new', label: 'New...', command: DIALOG_COMMAND.newFile },
      { key: 'file-open', label: 'Open...', command: FILE_COMMAND.open },
      recent,
      { key: 'file-save', label: 'Save', command: FILE_COMMAND.save },
      { key: 'file-save-as', label: 'Save as...', command: FILE_COMMAND.saveAs },
      { key: 'file-save-all', label: 'Save all', command: FILE_COMMAND.saveAll },
      { key: 'file-export', label: 'Export...', command: FILE_COMMAND.export },
      { key: 'file-settings', label: settingsLabel, command: ASSET_SETTINGS_COMMAND },
      'separator',
      { key: 'file-new-sprite', label: 'New sprite...', command: DIALOG_COMMAND.newSprite },
      { key: 'file-import', label: 'Import image...', command: DIALOG_COMMAND.importImage },
      { key: 'file-import-tiled', label: 'Import Tiled map...', command: TILED_COMMAND.importMap },
    ],
  },
];

export { fileMenu };
