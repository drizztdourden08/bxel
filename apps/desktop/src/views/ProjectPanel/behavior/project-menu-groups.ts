/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { PROJECT_TEXT } from '../../../project/project.constants';
import { PANEL_UI, PROJECT_MENU } from '../ProjectPanel.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';

const projectMenuGroups = (model: ProjectPanelModel): readonly MenuGroup[] => [
  {
    id: 'switch',
    items: [
      {
        id: 'switch',
        label: PANEL_UI.switchProject,
        icon: 'folder-open',
        children: [
          ...model.recents.map((recent) => ({ id: recent.rootRealPath, label: recent.name, onSelect: () => model.openRecent(recent.rootRealPath) })),
          ...(model.recents.length > 0 ? [{ separator: true } as const] : []),
          { id: 'open', label: PROJECT_TEXT.openProject, onSelect: model.openProject },
          { id: 'new', label: PROJECT_TEXT.newProject, onSelect: model.newProject },
        ],
      },
      { id: 'hub', label: PROJECT_MENU.hub, icon: 'layout-dashboard', onSelect: model.openHub },
      { id: 'settings', label: PROJECT_MENU.settings, icon: 'settings', onSelect: model.openSettings },
      { id: 'pack', label: PROJECT_MENU.pack, icon: 'package', onSelect: model.pack },
    ],
  },
  { id: 'close', items: [{ id: 'close', label: PROJECT_MENU.close, icon: 'x', onSelect: model.closeProject }] },
];

export { projectMenuGroups };
