/* @layer renderer-app @kind hook */
import { useCallback, useMemo, useState } from 'react';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { activeRects } from '../../../image-import/active-rects';
import { colorsView } from '../../../image-import/colors-view';
import { finishImport } from '../../../image-import/finish-import';
import { importContext } from '../../../image-import/import-context';
import { importErrors } from '../../../image-import/import-errors';
import { memoryOf } from '../../../asset-defaults/memory-of';
import { useEffectiveDefaults } from '../../../asset-defaults/useEffectiveDefaults';
import { importNames } from '../../../image-import/import-names';
import type { ImportForm, ImportStep, ImportTarget, SliceForm, SourceImage } from '../../../image-import/image-import.type';
import { initialImportForm } from '../../../image-import/initial-import-form';
import { stepIssue } from '../../../image-import/step-issue';
import { switchTarget } from '../../../image-import/switch-target';
import { stepsOf } from '../../../image-import/steps-of';
import { useImportStore } from '../../../stores/useImportStore';
import type { TiledImportData } from '../../../tiled-import/tiled-import.type';
import type { ImportWizardState } from '../ImportWizard.type';

const useImportWizard = (image: SourceImage, tiled: TiledImportData | null): ImportWizardState => {
  const view = useActiveDocument();
  const context = useMemo(() => importContext(view), [view]);
  const defaults = useEffectiveDefaults();
  const memory = useMemo(() => memoryOf(defaults), [defaults]);
  const [form, setForm] = useState<ImportForm>(() => initialImportForm(image, context, memory, tiled ? 'tiled' : 'sprite'));
  const [step, setStep] = useState<ImportStep>('source');
  const [failure, setFailure] = useState<string | null>(null);
  const { target, reduce, dither, alphaPercent, limit, transparent, source } = form;
  const colorsForm = useMemo(
    () => ({ target, reduce, dither, alphaPercent, limit, transparent, source }),
    [target, reduce, dither, alphaPercent, limit, transparent, source],
  );
  const colors = useMemo(() => colorsView(colorsForm, image, context), [colorsForm, image, context]);
  const rects = useMemo(() => activeRects(form, image), [form, image]);
  const names = useMemo(() => importNames(form, rects), [form, rects]);
  const errors = useMemo(() => importErrors({ form, image, context, rects, names }), [form, image, context, rects, names]);
  const steps = stepsOf(form.kind);
  const issue = stepIssue(step, errors, colors);

  const update = useCallback((change: Partial<ImportForm>): void => {
    setFailure(null);
    setForm((current) => ({ ...current, ...change }));
  }, []);
  const setSlice = useCallback((change: Partial<SliceForm>): void => {
    setForm((current) => ({ ...current, slice: { ...current.slice, ...change } }));
  }, []);
  const setTarget = useCallback(
    (next: ImportTarget): void => setForm((current) => switchTarget(current, next, image, context)),
    [image, context],
  );
  const back = useCallback((): void => setStep(steps[Math.max(0, steps.indexOf(step) - 1)] ?? 'source'), [steps, step]);
  const cancel = useCallback((): void => useImportStore.getState().hide(), []);

  const advance = useCallback((): void => {
    const following = steps[steps.indexOf(step) + 1];
    if (following !== undefined) {
      setStep(following);
      return;
    }
    if (!colors.plan) return;
    const failed = finishImport({ form, image, plan: colors.plan, rects, names, context, tiled });
    if (failed !== null) setFailure(failed);
  }, [steps, step, colors.plan, form, image, rects, names, context, tiled]);

  return { form, step, steps, colors, errors, rects, names, context, tiled, issue, failure, update, setSlice, setTarget, advance, back, cancel };
};

export { useImportWizard };
