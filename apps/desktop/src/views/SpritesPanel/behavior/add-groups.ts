/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { startImport } from '../../../image-import/start-import';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import type { ManagerSettings } from '../../../stores/manager-store.type';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import type { ManagerModel } from '../SpritesPanel.type';

const addGroups = (model: ManagerModel, patch: (change: Partial<ManagerSettings>) => void): MenuGroup[] => [
  {
    id: 'add',
    items: [
      { id: 'add-project', label: SHEET_TEXT.addFromProject, icon: 'folder-open', shortcut: 'Insert', onSelect: () => patch({ libraryRequest: Date.now() }) },
      { id: 'new-sprite', label: SHEET_TEXT.newSprite, icon: 'plus', onSelect: () => useCreateDialogStore.getState().show('sprite') },
      {
        id: 'import-image',
        label: SHEET_TEXT.importImage,
        icon: 'image',
        onSelect: () => {
          void startImport();
        },
      },
      {
        id: 'slice-image',
        label: SHEET_TEXT.sliceImage,
        icon: 'pixel-grid-view',
        disabled: model.ids.length === 0,
        onSelect: () => patch({ dialog: 'slice' }),
      },
    ],
  },
];

export { addGroups };
