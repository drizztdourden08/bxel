/* @layer renderer-app @kind constants */
import { PROJECT_GROUP } from '../project/project.constants';
import { COMMAND_ZONE } from './command-zone.constants';
import { COMMAND_GROUP } from './keymap.constants';
import type { ZoneKey } from './zone-key.type';

const LAYER_RENAME_KEY: ZoneKey = {
  id: 'layer.rename',
  label: 'Rename layer',
  group: COMMAND_GROUP.layers,
  chord: 'F2',
  zone: COMMAND_ZONE.layers,
};

const PROJECT_RENAME_KEY: ZoneKey = {
  id: 'project.rename_entry',
  label: 'Rename file or folder',
  group: PROJECT_GROUP,
  chord: 'F2',
  zone: COMMAND_ZONE.project,
};

const PROJECT_TRASH_KEY: ZoneKey = {
  id: 'project.trash_entry',
  label: 'Move file or folder to the trash',
  group: PROJECT_GROUP,
  chord: 'Delete',
  zone: COMMAND_ZONE.project,
};

const PROJECT_DUPLICATE_KEY: ZoneKey = {
  id: 'project.duplicate_entry',
  label: 'Duplicate the selected assets',
  group: PROJECT_GROUP,
  chord: 'Mod+D',
  zone: COMMAND_ZONE.project,
};

const PROJECT_SELECT_ALL_KEY: ZoneKey = {
  id: 'project.select_all',
  label: 'Select all shown files',
  group: PROJECT_GROUP,
  chord: 'Mod+A',
  zone: COMMAND_ZONE.project,
};

const PROJECT_NEW_FOLDER_KEY: ZoneKey = {
  id: 'project.new_folder_here',
  label: 'New folder in the focused folder',
  group: PROJECT_GROUP,
  chord: 'Mod+Shift+N',
  zone: COMMAND_ZONE.project,
};

const PROJECT_NEW_MENU_KEY: ZoneKey = {
  id: 'project.new_menu',
  label: 'Open the New menu',
  group: PROJECT_GROUP,
  chord: 'Mod+N',
  zone: COMMAND_ZONE.project,
};

const PROJECT_FIND_KEY: ZoneKey = {
  id: 'project.find',
  label: 'Search the project',
  group: PROJECT_GROUP,
  chord: 'Mod+F',
  zone: COMMAND_ZONE.project,
};

const SPRITE_SELECT_ALL_KEY: ZoneKey = {
  id: 'sprite.select_visible',
  label: 'Select all shown sprites',
  group: COMMAND_GROUP.sheet,
  chord: 'Mod+A',
  zone: COMMAND_ZONE.sprites,
};

export {
  LAYER_RENAME_KEY,
  PROJECT_DUPLICATE_KEY,
  PROJECT_FIND_KEY,
  PROJECT_NEW_FOLDER_KEY,
  PROJECT_NEW_MENU_KEY,
  PROJECT_RENAME_KEY,
  PROJECT_SELECT_ALL_KEY,
  PROJECT_TRASH_KEY,
  SPRITE_SELECT_ALL_KEY,
};
