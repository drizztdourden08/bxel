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

const SPRITE_REMOVE_KEY: ZoneKey = {
  id: 'sprite.remove_entries_key',
  label: 'Remove from sheet',
  group: COMMAND_GROUP.sheet,
  chord: 'Backspace',
  zone: COMMAND_ZONE.sprites,
};

const SPRITE_COPY_KEY: ZoneKey = {
  id: 'sprite.copy_entries_key',
  label: 'Copy the picked entries',
  group: COMMAND_GROUP.sheet,
  chord: 'Mod+C',
  zone: COMMAND_ZONE.sprites,
};

const SPRITE_CUT_KEY: ZoneKey = {
  id: 'sprite.cut_entries_key',
  label: 'Cut the picked entries',
  group: COMMAND_GROUP.sheet,
  chord: 'Mod+X',
  zone: COMMAND_ZONE.sprites,
};

const SPRITE_PASTE_KEY: ZoneKey = {
  id: 'sprite.paste_entries_key',
  label: 'Paste entries on the sheet',
  group: COMMAND_GROUP.sheet,
  chord: 'Mod+V',
  zone: COMMAND_ZONE.sprites,
};

const PALETTE_PASTE_KEY: ZoneKey = {
  id: 'palette.paste_colours_key',
  label: 'Paste hex colours into the palette',
  group: COMMAND_GROUP.colours,
  chord: 'Mod+V',
  zone: COMMAND_ZONE.palette,
};

export {
  LAYER_RENAME_KEY,
  PALETTE_PASTE_KEY,
  PROJECT_DUPLICATE_KEY,
  PROJECT_FIND_KEY,
  PROJECT_NEW_FOLDER_KEY,
  PROJECT_NEW_MENU_KEY,
  PROJECT_RENAME_KEY,
  PROJECT_SELECT_ALL_KEY,
  PROJECT_TRASH_KEY,
  SPRITE_ADD_KEY,
  SPRITE_COPY_KEY,
  SPRITE_CUT_KEY,
  SPRITE_PASTE_KEY,
  SPRITE_REMOVE_KEY,
  SPRITE_SEARCH_KEY,
  SPRITE_SELECT_ALL_KEY,
};
