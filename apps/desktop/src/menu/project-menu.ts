/* @layer renderer-app @kind logic */
import type { RecentProject } from '@bxel/project';
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
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

const projectMenu = (recent: readonly RecentProject[], isOpen: boolean, open: (root: string) => void): MenuItem => ({
  key: 'project',
  label: PROJECT_TEXT.menu,
  icon: 'folder',
  children: [
    menuItem(PROJECT_COMMAND.new, PROJECT_TEXT.newProject),
    menuItem(PROJECT_COMMAND.open, PROJECT_TEXT.openProject),
    { key: 'project-open-recent', label: PROJECT_TEXT.openRecent, children: recentEntries(recent, open) },
    'separator',
    menuItem(PROJECT_COMMAND.panel, PROJECT_TEXT.showPanel),
    menuItem(PROJECT_COMMAND.settings, PROJECT_TEXT.settings, { disabled: !isOpen }),
    menuItem(PROJECT_COMMAND.close, PROJECT_TEXT.closeProject, { disabled: !isOpen }),
  ],
});

export { projectMenu };
