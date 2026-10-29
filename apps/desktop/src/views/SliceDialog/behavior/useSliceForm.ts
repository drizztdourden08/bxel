/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import type { Slice } from '@bxel/document';
import { currentTarget } from '../../../editor/current-target';
import { updateSlice } from '../../../slice/update-slice';
import { useSliceToolStore } from '../../../stores/useSliceToolStore';
import type { SliceForm, SliceFormModel } from '../SliceDialog.type';
import { formOfSlice } from './form-of-slice';
import { sliceFormValid } from './slice-form-valid';

const useSliceForm = (slice: Slice): SliceFormModel => {
  const [form, setForm] = useState<SliceForm>(() => formOfSlice(slice));
  const sprite = currentTarget()?.sprite;
  const taken = useMemo(() => (sprite?.slices ?? []).filter((other) => other.id !== slice.id).map((other) => other.name), [sprite, slice.id]);
  const valid = sprite !== undefined && sliceFormValid(form, sprite, taken);
  return {
    form,
    valid,
    update: (change) => setForm((current) => ({ ...current, ...change })),
    apply: () => {
      if (!valid) return;
      const done = updateSlice(slice.id, {
        name: form.name.trim(),
        rect: form.rect,
        pivot: form.pivotOn ? form.pivot : null,
        center: form.centreOn ? form.centre : null,
      });
      if (done) useSliceToolStore.getState().closeDialog();
    },
  };
};

export { useSliceForm };
