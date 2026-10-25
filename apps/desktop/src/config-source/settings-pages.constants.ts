/* @layer renderer-app @kind constants */
import type { Section } from '@drizztdourden08/brock-react';
import appAssistant from '../screens/app/assistant.settings';
import appCanvas from '../screens/app/canvas.settings';
import appDefaults from '../screens/app/defaults.settings';
import appGeneral from '../screens/app/general.settings';
import palette from '../screens/asset/palette.settings';
import sheet from '../screens/asset/sheet.settings';
import spritePalette from '../screens/asset/sprite-palette.settings';
import spritePlatform from '../screens/asset/sprite-platform.settings';
import sprite from '../screens/asset/sprite.settings';
import tilemap from '../screens/asset/tilemap.settings';
import tileset from '../screens/asset/tileset.settings';
import projectAssistant from '../screens/project/assistant.settings';
import projectDefaults from '../screens/project/defaults.settings';
import projectExport from '../screens/project/export.settings';
import projectFolders from '../screens/project/folders.settings';
import projectGeneral from '../screens/project/general.settings';
import projectPalettes from '../screens/project/palettes.settings';

const SETTINGS_PAGES: readonly (readonly Section[])[] = [
  appGeneral,
  appCanvas,
  appDefaults,
  appAssistant,
  sprite,
  spritePalette,
  spritePlatform,
  sheet,
  palette,
  tilemap,
  tileset,
  projectGeneral,
  projectFolders,
  projectDefaults,
  projectPalettes,
  projectAssistant,
  projectExport,
];

export { SETTINGS_PAGES };
