/* @layer renderer-app @kind component */
import { AnchorPicker, Field } from '@drizztdourden08/tessera';
import { anchorOfPivot } from '../../../editor/transform/anchor-of-pivot';
import { presetPivot } from '../../../editor/transform/preset-pivot';
import { reviseTransform } from '../../../editor/transform/revise-transform';
import { TRANSFORM_BAR_TEXT } from '../TransformBar.constants';
import type { PivotFieldProps } from '../TransformBar.type';

const PivotField = ({ model }: PivotFieldProps) => (
  <Field label={TRANSFORM_BAR_TEXT.pivot} inline size="sm">
    <AnchorPicker
      size="xs"
      label={TRANSFORM_BAR_TEXT.pivot}
      customLabel={TRANSFORM_BAR_TEXT.pivotCustom}
      value={anchorOfPivot(model.box, model.spec) ?? 'custom'}
      disabled={model.spec.corners !== null}
      onChange={(next) => reviseTransform((spec) => presetPivot(model.box, spec, next))}
    />
  </Field>
);

export { PivotField };
