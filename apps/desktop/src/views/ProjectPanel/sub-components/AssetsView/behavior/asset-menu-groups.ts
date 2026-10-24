/* @layer renderer-app @kind logic */
import type { MenuGroup, MenuItem } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../../../asset-list/asset-list-text.constants';
import { canCopyForSheet } from '../../../../../asset-list/can-copy-for-sheet';
import { canExport } from '../../../../../asset-list/can-export';
import { canDuplicate } from '../../../../../asset-list/can-duplicate';
import type { AssetRowProps } from '../AssetsView.type';

const when = (show: boolean, item: MenuItem): MenuItem[] => (show ? [item] : []);

const assetMenuGroups = ({ model, row }: AssetRowProps): MenuGroup[] => [
  {
    id: 'asset',
    items: [
      { id: 'open', label: ASSET_LIST_TEXT.open, icon: 'folder-open', onSelect: () => model.open(row) },
      { id: 'rename', label: ASSET_LIST_TEXT.rename, icon: 'pencil', onSelect: () => model.startRename(row) },
      ...when(row.path !== '', { id: 'reveal', label: ASSET_LIST_TEXT.reveal, icon: 'folder', onSelect: () => model.reveal(row) }),
      ...when(canDuplicate(row), { id: 'duplicate', label: ASSET_LIST_TEXT.duplicate, icon: 'copy', onSelect: () => model.duplicate(row) }),
      ...when(canCopyForSheet(row), { id: 'copy-sheet', label: ASSET_LIST_TEXT.copyForSheet, icon: 'copy', onSelect: () => model.copyForSheet(row) }),
      ...when(canExport(row), { id: 'export', label: ASSET_LIST_TEXT.export, icon: 'pixel-export-image', onSelect: () => model.exportRow(row) }),
      { separator: true },
      { id: 'trash', label: ASSET_LIST_TEXT.trash, icon: 'trash-2', tone: 'danger', onSelect: () => model.trash(row) },
    ],
  },
];

export { assetMenuGroups };
