/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { openExport } from '../export/open-export';
import { FILE_COMMAND, FILE_TEXT } from './files.constants';
import { hasActiveDocument } from './has-active-document';
import { runFileAction } from './run-file-action';
import { needs } from '../keymap/needs';
import { REASON } from '../ui-context/reasons.constants';

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
    ...needs(hasActiveDocument, REASON.noDocument),
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
    ...needs(hasActiveDocument, REASON.noDocument),
    run: () => {
      void runFileAction({ kind: 'saveAs' });
    },
  },
  {
    id: FILE_COMMAND.saveAll,
    label: 'Save all files',
    icon: 'pixel-save-file',
    group: FILE_TEXT.group,
    chord: 'Mod+Alt+S',
    ...needs(hasActiveDocument, REASON.noDocument),
    run: () => {
      void runFileAction({ kind: 'saveAll' });
    },
  },
  {
    id: FILE_COMMAND.export,
    label: 'Export',
    icon: 'pixel-export-image',
    group: FILE_TEXT.group,
    chord: 'Mod+Shift+E',
    ...needs(hasActiveDocument, REASON.noDocument),
    run: () => openExport(),
  },
];

export { FILE_COMMANDS };
