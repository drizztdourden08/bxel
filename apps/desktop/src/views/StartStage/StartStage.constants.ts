/* @layer renderer-app @kind constants */
import { DEMO_COMMAND_ID } from '../../demo/demo.constants';
import { DIALOG_COMMAND } from '../../keymap/dialog-command-id.constants';
import { FILE_COMMAND } from '../../files/files.constants';
import type { StartAction } from './StartStage.type';

const START_TEXT = {
  region: 'Start',
  title: 'Nothing is open',
  message: 'Create an asset, open a file or a project, or try the demo project.',
} as const;

const START_ACTIONS: readonly StartAction[] = [
  { id: 'new', label: 'New asset', icon: 'plus', command: DIALOG_COMMAND.newFile, variant: 'primary' },
  { id: 'open', label: 'Open', icon: 'folder-open', command: FILE_COMMAND.open, variant: 'secondary' },
  { id: 'demo', label: 'Open the demo project', icon: 'folder-open', command: DEMO_COMMAND_ID, variant: 'secondary' },
];

export { START_ACTIONS, START_TEXT };
