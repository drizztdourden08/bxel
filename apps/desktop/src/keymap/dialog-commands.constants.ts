/* @layer renderer-app @kind constants */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { hasActiveDocument } from '../files/has-active-document';
import { startImport } from '../image-import/start-import';
import { startChange } from '../palette-change/start-change';
import { useCreateDialogStore } from '../stores/useCreateDialogStore';
import { DIALOG_COMMAND } from './dialog-command-id.constants';
import { editorCommand } from './editor-command';
import { COMMAND_GROUP } from './keymap.constants';

const FILE_DIALOG_COMMANDS: readonly CommandDef[] = [
  {
    id: DIALOG_COMMAND.newFile,
    label: 'New file',
    icon: 'file',
    group: 'File',
    chord: 'Mod+N',
    run: () => useCreateDialogStore.getState().show('file'),
  },
  {
    id: DIALOG_COMMAND.newSprite,
    label: 'New sprite',
    group: 'File',
    chord: 'Mod+Shift+N',
    when: hasActiveDocument,
    run: () => useCreateDialogStore.getState().show('sprite'),
  },
  {
    id: DIALOG_COMMAND.importImage,
    label: 'Import image',
    icon: 'image',
    group: 'File',
    chord: 'Mod+I',
    run: () => {
      void startImport();
    },
  },
];

const PALETTE_DIALOG_COMMANDS: readonly CommandDef[] = [
  { id: DIALOG_COMMAND.deleteSwatch, label: 'Delete swatch', group: COMMAND_GROUP.colours, run: () => startChange('delete') },
  { id: DIALOG_COMMAND.mergeSwatch, label: 'Merge swatch', group: COMMAND_GROUP.colours, run: () => startChange('merge') },
  { id: DIALOG_COMMAND.changeLimit, label: 'Change colour limit', group: COMMAND_GROUP.colours, run: () => startChange('limit') },
].map(editorCommand);

const DIALOG_COMMANDS: readonly CommandDef[] = [...FILE_DIALOG_COMMANDS, ...PALETTE_DIALOG_COMMANDS];

export { DIALOG_COMMANDS };
