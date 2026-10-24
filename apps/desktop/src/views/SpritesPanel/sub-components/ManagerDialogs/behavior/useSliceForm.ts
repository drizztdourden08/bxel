/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import { SLICE_START } from '../../../../../sheet-manager/compose.constants';
import type { SliceSpec } from '../../../../../sheet-manager/compose.type';
import { otherNames } from '../../../../../sheet-manager/other-names';
import { slicePlan } from '../../../../../sheet-manager/slice-plan';
import type { ManagerModel } from '../../../SpritesPanel.type';
import type { SliceForm } from '../ComposeDialogs.type';
import { useTargets } from './useTargets';

const useSliceForm = (model: ManagerModel): SliceForm => {
  const [spec, setSpec] = useState<SliceSpec>(SLICE_START);
  const targets = useTargets(model);
  const plan = useMemo(
    () => slicePlan(spec, targets, otherNames(model.artwork, targets, spec.keep)),
    [spec, targets, model.artwork],
  );
  return { spec, plan, targets, update: (change) => setSpec((current) => ({ ...current, ...change })) };
};

export { useSliceForm };
