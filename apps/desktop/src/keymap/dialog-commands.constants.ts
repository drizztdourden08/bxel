/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import type { SwatchArgs } from '../context-menu/menu-args.type';
import { hasActiveDocument } from '../files/has-active-document';
import { startImport } from '../image-import/start-import';
import { startChange } from '../palette-change/start-change';
import { useCreateDialogStore } from '../stores/useCreateDialogStore';
import { useImageTabStore } from '../stores/useImageTabStore';
import { importImageTab } from '../views/ImageStage/behavior/import-image-tab';
import { DIALOG_COMMAND } from './dialog-command-id.constants';
import { COMMAND_GROUP } from './keymap.constants';
import { gated } from './gated';
import { ruled } from './ruled';

const FILE_DIALOG_DEFS: readonly CommandDef[] = [
  {
    id: DIALOG_COMMAND.newFile,
    label: 'New asset',
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

const FILE_DIALOG_COMMANDS: readonly CommandDef[] = FILE_DIALOG_DEFS.map(gated);

const PALETTE_DIALOG_COMMANDS: readonly CommandDef[] = [
  { id: DIALOG_COMMAND.deleteSwatch, label: 'Delete swatch', group: COMMAND_GROUP.colours, run: (context?: CommandContext) => startChange('delete', commandArgs<SwatchArgs>(context).index) },
  { id: DIALOG_COMMAND.mergeSwatch, label: 'Merge swatch', group: COMMAND_GROUP.colours, run: (context?: CommandContext) => startChange('merge', commandArgs<SwatchArgs>(context).index) },
  { id: DIALOG_COMMAND.changeLimit, label: 'Change colour limit', group: COMMAND_GROUP.colours, run: () => startChange('limit') },
].map(ruled);

const IMAGE_DIALOG_COMMANDS: readonly CommandDef[] = [
  {
    id: 'image.import',
    label: 'Import the open image',
    group: 'File',
    run: () => {
      const { tabs, activeId } = useImageTabStore.getState();
      const tab = tabs.find((each) => each.id === activeId);
      if (tab) importImageTab(tab);
    },
  },
].map(ruled);

const DIALOG_COMMANDS: readonly CommandDef[] = [...FILE_DIALOG_COMMANDS, ...PALETTE_DIALOG_COMMANDS, ...IMAGE_DIALOG_COMMANDS];

export { DIALOG_COMMANDS };
