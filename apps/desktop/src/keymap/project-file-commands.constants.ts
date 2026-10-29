/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import { fileName } from '../files/file-name';
import { makeFolder } from '../file-ops/make-folder';
import { moveEntries } from '../file-ops/move-entries';
import { renameEntryLinked } from '../file-ops/rename-entry-linked';
import { trashEntries } from '../file-ops/trash-entries';
import { PROJECT_FILE_COMMAND, PROJECT_GROUP } from '../project/project.constants';
import type { FileOpArgs } from './project-file-args.type';

const args = (context: CommandContext | undefined): Partial<FileOpArgs> => commandArgs<FileOpArgs>(context);

const PROJECT_FILE_COMMANDS: readonly CommandDef[] = [
  {
    id: PROJECT_FILE_COMMAND.rename,
    label: 'Rename a project file or folder',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const { path, name } = args(context);
      if (path !== undefined && name !== undefined) void renameEntryLinked(path, name, !fileName(path).includes('.'));
    },
  },
  {
    id: PROJECT_FILE_COMMAND.move,
    label: 'Move project files into a folder',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const { paths, to } = args(context);
      if (paths !== undefined && to !== undefined) void moveEntries(paths, to);
    },
  },
  {
    id: PROJECT_FILE_COMMAND.trash,
    label: 'Move project files to the trash',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const { paths } = args(context);
      if (paths !== undefined) void trashEntries(paths);
    },
  },
  {
    id: PROJECT_FILE_COMMAND.makeFolder,
    label: 'Make a folder in the project',
    group: PROJECT_GROUP,
    run: (context?: CommandContext) => {
      const { path } = args(context);
      if (path !== undefined) void makeFolder(path);
    },
  },
];

export { PROJECT_FILE_COMMANDS };
