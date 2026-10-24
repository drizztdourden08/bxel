/* @layer renderer-app @kind hook */
import { useState } from 'react';
import { PIVOT_PRESETS } from '../../../../../sheet-manager/manager.constants';
import type { PivotMode } from '../../../../../sheet-manager/manager.type';
import { DIALOG_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { pivotSummary } from '../../../../../sheet-manager/pivot-summary';
import { PIVOT_START } from '../ManagerDialogs.constants';
import type { PivotForm, PivotFormState } from '../ManagerDialogs.type';
import type { ManagerModel } from '../../../SpritesPanel.type';
import { useTargets } from './useTargets';

const modeOf = (form: PivotFormState): PivotMode => {
  if (form.kind === 'exact') return { kind: 'exact', x: form.x, y: form.y };
  if (form.kind === 'first') return { kind: 'first' };
  const preset = PIVOT_PRESETS.find((each) => each.id === form.preset) ?? PIVOT_PRESETS[0];
  return { kind: 'preset', fx: preset?.fx ?? 0.5, fy: preset?.fy ?? 0.5 };
};

const usePivotForm = (model: ManagerModel): PivotForm => {
  const [form, setForm] = useState<PivotFormState>(PIVOT_START);
  const targets = useTargets(model);
  return {
    form,
    targets,
    mode: modeOf(form),
    now: pivotSummary(targets, DIALOG_TEXT.mixed),
    update: (change) => setForm((current) => ({ ...current, ...change })),
  };
};

export { usePivotForm };
