/* @layer renderer-app @kind logic */
import type { RecentProject } from '@bxel/project';
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { REASON } from '../ui-context/reasons.constants';
import { PACK_TEXT } from '../project/pack.constants';
import { PROJECT_COMMAND, PROJECT_TEXT } from '../project/project.constants';
import { menuItem } from './menu-item';

const recentEntries = (recent: readonly RecentProject[], open: (root: string) => void): MenuEntry[] =>
  recent.length === 0
    ? [{ key: 'project-recent-none', label: PROJECT_TEXT.recentNone, disabled: true }]
    : recent.map((entry): MenuItem => ({
        key: `project-recent:${entry.rootRealPath}`,
        label: entry.name,
        description: entry.rootRealPath,
        onClick: () => open(entry.rootRealPath),
      }));

const projectMenu = (recent: readonly RecentProject[], isOpen: boolean, open: (root: string) => void): MenuItem => {
  const closed = { disabled: !isOpen, ...(isOpen ? {} : { description: REASON.noProject }) };
  return {
  key: 'project',
  label: PROJECT_TEXT.menu,
  icon: 'folder',
  children: [
    menuItem(PROJECT_COMMAND.new, PROJECT_TEXT.newProject),
    menuItem(PROJECT_COMMAND.open, PROJECT_TEXT.openProject),
    { key: 'project-open-recent', label: PROJECT_TEXT.openRecent, children: recentEntries(recent, open) },
    'separator',
    menuItem(PROJECT_COMMAND.panel, PROJECT_TEXT.showPanel),
    menuItem(PROJECT_COMMAND.settings, PROJECT_TEXT.settings, closed),
    menuItem(PROJECT_COMMAND.pack, PACK_TEXT.menu, closed),
    menuItem(PROJECT_COMMAND.close, PROJECT_TEXT.closeProject, closed),
  ],
  };
};

export { projectMenu };
