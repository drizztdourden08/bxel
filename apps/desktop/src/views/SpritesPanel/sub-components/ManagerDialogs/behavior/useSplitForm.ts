/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import { SPLIT_START } from '../../../../../sheet-manager/compose.constants';
import type { SplitSpec } from '../../../../../sheet-manager/compose.type';
import { otherNames } from '../../../../../sheet-manager/other-names';
import { splitPlan } from '../../../../../sheet-manager/split-plan';
import type { ManagerModel } from '../../../SpritesPanel.type';
import type { SplitForm } from '../../../../../sheet-manager/dialog-form.type';
import { useTargets } from './useTargets';

const useSplitForm = (model: ManagerModel): SplitForm => {
  const [spec, setSpec] = useState<SplitSpec>(SPLIT_START);
  const picked = useTargets(model);
  const targets = useMemo(() => picked.filter((sprite) => sprite.frames.length > 1), [picked]);
  const plan = useMemo(
    () => splitPlan(spec, targets, otherNames(model.artwork, targets, spec.keep)),
    [spec, targets, model.artwork],
  );
  return { spec, plan, targets, skipped: picked.length - targets.length, update: (change) => setSpec((current) => ({ ...current, ...change })) };
};

export { useSplitForm };
