/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import { MERGE_START } from '../../../../../sheet-manager/compose.constants';
import type { MergeSpec } from '../../../../../sheet-manager/compose.type';
import { mergePlan } from '../../../../../sheet-manager/merge-plan';
import type { ManagerModel } from '../../../SpritesPanel.type';
import type { MergeForm } from '../../../../../sheet-manager/dialog-form.type';
import { useTargets } from './useTargets';

const useMergeForm = (model: ManagerModel): MergeForm => {
  const [spec, setSpec] = useState<MergeSpec>(MERGE_START);
  const targets = useTargets(model);
  const plan = useMemo(() => mergePlan(targets), [targets]);
  return { spec, plan, targets, update: (change) => setSpec((current) => ({ ...current, ...change })) };
};

export { useMergeForm };
