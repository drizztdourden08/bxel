/* @layer renderer-app @kind logic */
import type { RecentDocument } from '@drizztdourden08/brock-core';
import type { MenuEntry, MenuItem } from '@drizztdourden08/brock-react';
import { FILE_TEXT } from './files.constants';
import type { RecentActions } from './files.type';
import { isProjectPath } from './is-project-path';

const recentMenuItem = (recent: readonly RecentDocument[], actions: RecentActions): MenuItem => {
  const projects = recent.filter((entry) => isProjectPath(entry.path));
  const children: MenuEntry[] =
    projects.length === 0
      ? [{ key: 'file-recent-none', label: FILE_TEXT.recentNone, disabled: true }]
      : [
          ...projects.map((entry): MenuItem => ({
            key: `file-recent:${entry.path}`,
            label: entry.name,
            description: entry.path,
            onClick: () => actions.open(entry.path),
          })),
          'separator',
          { key: 'file-recent-clear', label: FILE_TEXT.recentClear, onClick: actions.clear },
        ];
  return { key: 'file-open-recent', label: FILE_TEXT.recentLabel, children };
};

export { recentMenuItem };
