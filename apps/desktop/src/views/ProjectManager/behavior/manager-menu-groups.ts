/* @layer renderer-app @kind logic */
import { nav } from '@drizztdourden08/brock-react';
import type { MenuGroup, MenuNode } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../project-manager/project-manager.constants';
import { assetMenuGroups } from '../../ProjectPanel/sub-components/AssetsView/behavior/asset-menu-groups';
import type { ManagerRowProps } from '../ProjectManager.type';

const swap = (item: MenuNode, { model, row }: ManagerRowProps): MenuNode[] => {
  if ('separator' in item) return [item];
  if (item.id === 'export') {
    return [
      {
        ...item,
        onSelect: () => {
          nav.close();
          item.onSelect?.();
        },
      },
    ];
  }
  if (item.id !== 'open') return [item];
  return [
    { id: 'asset-settings', label: MANAGER_TEXT.inAssetSettings, icon: 'sliders-horizontal', onSelect: () => model.actions.inAssetSettings(row) },
    { id: 'edit', label: MANAGER_TEXT.toEdit, icon: 'pencil', onSelect: () => model.actions.toEdit(row) },
  ];
};

const managerMenuGroups = (props: ManagerRowProps): MenuGroup[] =>
  assetMenuGroups({ model: props.model.assets, row: props.row }).map((group) => ({
    ...group,
    items: group.items.flatMap((item) => swap(item, props)),
  }));

export { managerMenuGroups };
