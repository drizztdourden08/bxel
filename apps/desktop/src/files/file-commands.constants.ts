/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { openExport } from '../export/open-export';
import { FILE_COMMAND, FILE_TEXT } from './files.constants';
import { hasActiveDocument } from './has-active-document';
import { runFileAction } from './run-file-action';

const FILE_COMMANDS: readonly CommandDef[] = [
  {
    id: FILE_COMMAND.open,
    label: 'Open file',
    icon: 'folder-open',
    group: FILE_TEXT.group,
    chord: 'Mod+O',
    run: () => {
      void runFileAction({ kind: 'open' });
    },
  },
  {
    id: FILE_COMMAND.save,
    label: 'Save file',
    icon: 'pixel-save-file',
    group: FILE_TEXT.group,
    chord: 'Mod+S',
    when: hasActiveDocument,
    run: () => {
      void runFileAction({ kind: 'save' });
    },
  },
  {
    id: FILE_COMMAND.saveAs,
    label: 'Save file as',
    icon: 'pixel-save-file',
    group: FILE_TEXT.group,
    chord: 'Mod+Shift+S',
    when: hasActiveDocument,
    run: () => {
      void runFileAction({ kind: 'saveAs' });
    },
  },
  {
    id: FILE_COMMAND.export,
    label: 'Export',
    icon: 'pixel-export-image',
    group: FILE_TEXT.group,
    chord: 'Mod+Shift+E',
    when: hasActiveDocument,
    run: () => openExport(),
  },
];

export { FILE_COMMANDS };
