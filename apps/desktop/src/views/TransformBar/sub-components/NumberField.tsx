/* @layer renderer-app @kind component */
import { AngleField, NumberField as ScrubField } from '@drizztdourden08/tessera';
import { applyField } from '../../../editor/transform/apply-field';
import { ANGLE_SNAP } from '../../../editor/transform/transform.constants';
import { fieldValue } from '../../../editor/transform/field-value';
import { reviseTransform } from '../../../editor/transform/revise-transform';
import { FIELD_LABELS, FIELD_RANGES, FIELD_STEPS } from '../TransformBar.constants';
import type { NumberFieldProps } from '../TransformBar.type';
import { ANGLE_FIELDS } from './NumberField.constants';
import { fieldId } from '../behavior/field-id';

const NumberField = ({ field, model }: NumberFieldProps) => {
  const value = fieldValue(model.box, model.spec, field);
  const change = (next: number): void => {
    reviseTransform((spec) => applyField(model.box, spec, field, next));
  };
  if (ANGLE_FIELDS.some((each) => each === field)) {
    return (
      <AngleField
        id={fieldId(field)}
        className="transform-bar__angle"
        size="sm"
        label={FIELD_LABELS[field]}
        aria-label={FIELD_LABELS[field]}
        snap={ANGLE_SNAP}
        dial={field === 'angle'}
        value={value}
        onChange={change}
      />
    );
  }
  return (
    <ScrubField
      id={fieldId(field)}
      className="transform-bar__number"
      size="sm"
      scrub
      label={FIELD_LABELS[field]}
      aria-label={FIELD_LABELS[field]}
      min={FIELD_RANGES[field].min}
      max={FIELD_RANGES[field].max}
      step={FIELD_STEPS[field]}
      value={value}
      onChange={change}
    />
  );
};

export { NumberField };
