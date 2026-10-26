/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import { ANIMATE_START } from '../../../../../sheet-manager/compose.constants';
import type { AnimateSpec } from '../../../../../sheet-manager/compose.type';
import { animatePlan } from '../../../../../sheet-manager/animate-plan';
import type { AnimateForm } from '../../../../../sheet-manager/dialog-form.type';
import type { ManagerModel } from '../../../SpritesPanel.type';
import { useTargets } from './useTargets';

const useAnimateForm = (model: ManagerModel): AnimateForm => {
  const [spec, setSpec] = useState<AnimateSpec>(ANIMATE_START);
  const targets = useTargets(model);
  const taken = useMemo(() => model.artwork.animations.map((animation) => animation.name), [model.artwork]);
  const plan = useMemo(() => animatePlan(targets, spec, taken), [targets, spec, taken]);
  return { spec, plan, targets, update: (change) => setSpec((current) => ({ ...current, ...change })) };
};

export { useAnimateForm };
