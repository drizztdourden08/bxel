/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import { folderPath } from '../../../../../sheet-manager/folder-path';
import { planFolder } from '../../../../../sheet-manager/plan-folder';
import type { ManagerModel } from '../../../SpritesPanel.type';
import type { FolderForm } from '../ManagerDialogs.type';
import { useTargets } from './useTargets';

const useFolderForm = (model: ManagerModel): FolderForm => {
  const targets = useTargets(model);
  const shared = new Set(targets.map((sprite) => folderPath(sprite.name)));
  const [folder, setFolder] = useState(shared.size === 1 ? ([...shared][0] ?? '') : '');
  const plan = useMemo(() => {
    const picked = new Set(targets.map((sprite) => sprite.id));
    const others = model.artwork.sprites.filter((sprite) => !picked.has(sprite.id)).map((sprite) => sprite.name);
    return planFolder(folder, targets, others);
  }, [folder, targets, model.artwork]);
  return { folder, plan, targets, update: setFolder };
};

export { useFolderForm };
