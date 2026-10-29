/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { PROJECT_COMMAND } from '../../../project/project.constants';
import { PROJECT_MENU } from '../ProjectPanel.constants';
import { newAssetEntry } from './new-asset-entry';

const backgroundEntries = (here: string): readonly ContextMenuEntry[] => [
  newAssetEntry(here === 'New' ? PROJECT_MENU.newAsset : here),
  { command: 'project.new_folder', label: PROJECT_MENU.newFolder },
  { command: 'project.collapse_all', label: PROJECT_MENU.collapseAll },
  { command: 'project.refresh', label: PROJECT_MENU.refresh },
  { command: 'project.reveal_root', label: PROJECT_MENU.revealRoot },
  'separator',
  { command: 'project.open_hub', label: PROJECT_MENU.hub },
  PROJECT_COMMAND.settings,
  PROJECT_COMMAND.pack,
  'separator',
  PROJECT_COMMAND.close,
];

export { backgroundEntries };
