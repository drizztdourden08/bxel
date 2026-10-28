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

const SPRITE_SELECT_ALL_KEY: ZoneKey = {
  id: 'sprite.select_visible',
  label: 'Select all shown sprites',
  group: COMMAND_GROUP.sheet,
  chord: 'Mod+A',
  zone: COMMAND_ZONE.sprites,
};

const SPRITE_SEARCH_KEY: ZoneKey = {
  id: 'sprite.search',
  label: 'Search the sheet',
  group: COMMAND_GROUP.sheet,
  chord: 'Mod+F',
  zone: COMMAND_ZONE.sprites,
};

const SPRITE_ADD_KEY: ZoneKey = {
  id: 'sprite.add_from_project',
  label: 'Add from project',
  group: COMMAND_GROUP.sheet,
  chord: 'Insert',
  zone: COMMAND_ZONE.sprites,
};

export { LAYER_RENAME_KEY, PROJECT_RENAME_KEY, PROJECT_TRASH_KEY, SPRITE_ADD_KEY, SPRITE_SEARCH_KEY, SPRITE_SELECT_ALL_KEY };
