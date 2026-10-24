/* @layer renderer-app @kind component */
import { Field, SegmentedControl } from '@drizztdourden08/tessera';
import { BOUNDS_CHOICES, BOUNDS_LABELS } from '../../../editor/pending/pending.constants';
import { TRANSFORM_DIALOG_TEXT } from '../TransformDialog.constants';
import type { BoundsFieldProps } from '../TransformDialog.type';

const BoundsField = ({ bounds, onChange }: BoundsFieldProps) => (
  <Field label={TRANSFORM_DIALOG_TEXT.bounds}>
    <SegmentedControl
      size="sm"
      aria-label={TRANSFORM_DIALOG_TEXT.boundsName}
      value={bounds}
      options={BOUNDS_CHOICES.map((each) => ({ value: each, label: BOUNDS_LABELS[each] }))}
      onChange={onChange}
    />
  </Field>
);

export { BoundsField };
