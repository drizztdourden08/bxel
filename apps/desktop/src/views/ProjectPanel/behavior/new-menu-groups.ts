/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import { ITEM_ICON } from '../../../panel-browser/project-browser.constants';
import { NEW_ASSET_KINDS, PROJECT_MENU } from '../ProjectPanel.constants';
import type { ProjectPanelModel } from '../ProjectPanel.type';
import { newAnimationFrom } from './new-animation-from';
import { newSheetFrom } from './new-sheet-from';
import { spriteIdsOf } from './sprite-ids-of';

const fromSelection = (model: ProjectPanelModel): readonly MenuGroup[] => {
  const { targets } = model.selection;
  if (spriteIdsOf(targets).length === 0) return [];
  return [
    {
      id: 'new-from',
      items: [
        { id: 'sheet-from', label: PROJECT_MENU.newSheetFrom, icon: ITEM_ICON.sheet, onSelect: () => newSheetFrom(targets) },
        { id: 'animation-from', label: PROJECT_MENU.newAnimationFrom, icon: ITEM_ICON.animation, onSelect: () => newAnimationFrom(targets) },
      ],
    },
  ];
};

const newMenuGroups = (model: ProjectPanelModel): readonly MenuGroup[] => [
  {
    id: 'new-asset',
    label: model.rowActions.newHere,
    items: NEW_ASSET_KINDS.map((kind) => ({
      id: kind,
      label: ASSET_LIST_TEXT.newKinds[kind],
      icon: ITEM_ICON[kind],
      onSelect: () => model.rowActions.newAsset(kind),
    })),
  },
  {
    id: 'new-folder',
    items: [{ id: 'folder', label: PROJECT_MENU.newFolder, icon: 'folder', shortcut: 'Ctrl+Shift+N', onSelect: () => model.rowActions.newFolder() }],
  },
  ...fromSelection(model),
];

export { newMenuGroups };
