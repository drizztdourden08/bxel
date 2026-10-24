/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import type { RenameSpec } from '../../../../../sheet-manager/manager.type';
import { planRenames } from '../../../../../sheet-manager/plan-renames';
import { DUPLICATE_START, RENAME_START } from '../ManagerDialogs.constants';
import type { RenameForm } from '../ManagerDialogs.type';
import type { ManagerModel } from '../../../SpritesPanel.type';
import { useTargets } from './useTargets';

const useRenameForm = (model: ManagerModel, copying = false): RenameForm => {
  const [spec, setSpec] = useState<RenameSpec>(copying ? DUPLICATE_START : RENAME_START);
  const targets = useTargets(model);
  const plan = useMemo(() => {
    const picked = new Set(copying ? [] : targets.map((sprite) => sprite.id));
    const others = model.artwork.sprites.filter((sprite) => !picked.has(sprite.id)).map((sprite) => sprite.name);
    return planRenames(spec, targets, others);
  }, [spec, targets, model.artwork, copying]);
  return { spec, plan, targets, update: (change) => setSpec((current) => ({ ...current, ...change })) };
};

export { useRenameForm };
