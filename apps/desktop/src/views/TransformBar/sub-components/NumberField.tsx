/* @layer renderer-app @kind component */
import { Field, NumberInput } from '@drizztdourden08/tessera';
import { applyField } from '../../../editor/transform/apply-field';
import { fieldValue } from '../../../editor/transform/field-value';
import { reviseTransform } from '../../../editor/transform/revise-transform';
import { FIELD_LABELS, FIELD_STEPS } from '../TransformBar.constants';
import type { NumberFieldProps } from '../TransformBar.type';
import { fieldId } from '../behavior/field-id';

const NumberField = ({ field, model }: NumberFieldProps) => (
  <Field label={FIELD_LABELS[field]} inline size="sm" htmlFor={fieldId(field)}>
    <NumberInput
      id={fieldId(field)}
      size="sm"
      step={FIELD_STEPS[field]}
      value={fieldValue(model.box, model.spec, field)}
      aria-label={FIELD_LABELS[field]}
      onChange={(value) => reviseTransform((spec) => applyField(model.box, spec, field, value))}
    />
  </Field>
);

export { NumberField };
