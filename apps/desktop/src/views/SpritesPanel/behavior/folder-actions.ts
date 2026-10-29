/* @layer renderer-app @kind logic */
import type { ActionItem } from '@drizztdourden08/tessera';
import { FOLDER_TEXT } from '../../../sheet-manager/folder-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';

const folderActions = (path: string, others: readonly string[]): ActionItem[] => [
  {
    id: 'rename-folder',
    label: FOLDER_TEXT.rename(path),
    icon: 'pixel-pencil',
    onSelect: () => useManagerStore.getState().patch({ dialog: 'renameFolder', folderTarget: path }),
  },
  {
    id: 'collapse-others',
    label: FOLDER_TEXT.collapseOthers(path),
    icon: 'chevrons-up-down',
    onSelect: () => useManagerStore.getState().patch({ collapsed: others }),
  },
];

export { folderActions };
