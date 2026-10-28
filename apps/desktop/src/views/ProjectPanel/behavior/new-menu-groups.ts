/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import { ITEM_ICON } from '../../../panel-browser/project-browser.constants';
import { KIND_SHORTCUT, NEW_ASSET_KINDS, PROJECT_MENU } from '../ProjectPanel.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';

const newMenuGroups = (model: ProjectPanelModel): readonly MenuGroup[] => [
  {
    id: 'new-asset',
    label: model.rowActions.newHere,
    items: NEW_ASSET_KINDS.map((kind) => ({
      id: kind,
      label: ASSET_LIST_TEXT.newKinds[kind],
      icon: ITEM_ICON[kind],
      shortcut: KIND_SHORTCUT[kind],
      onSelect: () => model.rowActions.newAsset(kind),
    })),
  },
  {
    id: 'new-folder',
    items: [{ id: 'folder', label: PROJECT_MENU.newFolder, icon: 'folder', shortcut: 'Ctrl+Shift+N', onSelect: () => model.rowActions.newFolder() }],
  },
];

export { newMenuGroups };
