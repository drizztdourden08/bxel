/* @layer renderer-app @kind constants */
import type { CommandContext, CommandDef } from '@drizztdourden08/brock-react';
import { commandArgs } from '../context-menu/command-args';
import { openSectionSettings } from '../view-section/open-section-settings';
import { resetSection } from '../view-section/reset-section';
import { toggleSectionInToolbar } from '../view-section/toggle-section-in-toolbar';
import { SECTION_COMMAND, SECTION_MENU } from '../view-section/view-section.constants';
import type { ViewSectionArgs } from '../view-section/view-section.type';
import { COMMAND_GROUP } from './keymap.constants';

const group = COMMAND_GROUP.view;

const onSection = (run: (section: ViewSectionArgs['section']) => void) => (context?: CommandContext) => {
  const { section } = commandArgs<ViewSectionArgs>(context);
  if (section !== undefined) run(section);
};

const VIEW_SECTION_COMMANDS: readonly CommandDef[] = [
  { id: SECTION_COMMAND.reset, label: SECTION_MENU.reset, group, run: onSection(resetSection) },
  { id: SECTION_COMMAND.toolbar, label: SECTION_MENU.toolbar, group, run: onSection(toggleSectionInToolbar) },
  { id: SECTION_COMMAND.settings, label: SECTION_MENU.settings, group, run: onSection(openSectionSettings) },
];

export { VIEW_SECTION_COMMANDS };
