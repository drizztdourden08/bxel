/* @layer renderer-app @kind logic */
import type { VirtualGridSection } from '@drizztdourden08/tessera';
import { FOLDER_TEXT } from '../../../sheet-manager/folder-text.constants';
import type { FolderGroup } from '../../../sheet-manager/folders.type';
import type { SpriteFacts } from '../../../sheet-manager/manager.type';
import { selectIds } from '../../../sheet-manager/select-ids';
import { FOLDER_DEPTH_LIMIT } from '../SpritesPanel.constants';

const gridSection = (group: FolderGroup): VirtualGridSection<SpriteFacts> => {
  const name = group.path === '' ? FOLDER_TEXT.root : group.path;
  return {
    key: group.path,
    label: name,
    items: group.facts,
    depth: Math.min(Math.max(group.depth - 1, 0), FOLDER_DEPTH_LIMIT),
    actions: [
      {
        id: 'select',
        label: FOLDER_TEXT.select(name),
        icon: 'check',
        onSelect: () => selectIds(group.facts.map((fact) => fact.sprite.id)),
      },
    ],
  };
};

export { gridSection };
