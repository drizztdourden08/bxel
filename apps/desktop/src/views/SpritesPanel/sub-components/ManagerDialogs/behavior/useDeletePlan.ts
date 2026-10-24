/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { Sprite } from '@bxel/document';
import { deletePlan } from '../../../../../sheet-manager/delete-plan';
import type { DeletePlan } from '../../../../../sheet-manager/delete.type';
import type { ManagerModel } from '../../../SpritesPanel.type';
import { useTargets } from './useTargets';

const useDeletePlan = (model: ManagerModel): { plan: DeletePlan; targets: readonly Sprite[] } => {
  const targets = useTargets(model);
  const plan = useMemo(() => deletePlan(model.artwork, targets), [model.artwork, targets]);
  return { plan, targets };
};

export { useDeletePlan };
