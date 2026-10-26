/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import { stripPlan } from '../../../../../add-frames/strip-plan';
import { CUT_STRIP_START } from '../../../../../sheet-manager/compose.constants';
import type { CutStripSpec } from '../../../../../sheet-manager/compose.type';
import { COMPOSE_TEXT } from '../../../../../sheet-manager/compose-text.constants';
import type { CutStripForm } from '../../../../../sheet-manager/dialog-form.type';
import { nameError } from '../../../../../sprite-name/name-error';
import type { ManagerModel } from '../../../SpritesPanel.type';
import { useTargets } from './useTargets';

const blockerOf = (count: number, name: string, taken: readonly string[]): string | null => (count === 1 ? nameError(name, taken) : COMPOSE_TEXT.needStrip);

const useCutStripForm = (model: ManagerModel): CutStripForm => {
  const [spec, setSpec] = useState<CutStripSpec>(CUT_STRIP_START);
  const targets = useTargets(model);
  const target = targets.length === 1 ? (targets[0] ?? null) : null;
  const plan = useMemo(() => stripPlan(target, spec.strip), [target, spec.strip]);
  const taken = useMemo(() => model.artwork.animations.map((animation) => animation.name), [model.artwork]);
  const name = spec.name.trim() === '' ? (target?.name ?? '') : spec.name.trim();
  const blocker = blockerOf(targets.length, name, taken) ?? plan.error;
  return { spec, plan, target, blocker, update: (change) => setSpec((current) => ({ ...current, ...change })) };
};

export { useCutStripForm };
