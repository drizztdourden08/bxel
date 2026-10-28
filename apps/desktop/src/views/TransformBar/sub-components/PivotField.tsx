/* @layer renderer-app @kind component */
import { AnchorPicker, Field, Text } from '@drizztdourden08/tessera';
import { anchorOfPivot } from '../../../editor/transform/anchor-of-pivot';
import { presetPivot } from '../../../editor/transform/preset-pivot';
import { reviseTransform } from '../../../editor/transform/revise-transform';
import { TRANSFORM_BAR_TEXT } from '../TransformBar.constants';
import type { PivotFieldProps } from '../TransformBar.type';

const PivotField = ({ model }: PivotFieldProps) => {
  const anchor = anchorOfPivot(model.box, model.spec);
  return (
    <Field label={TRANSFORM_BAR_TEXT.pivot} inline size="sm">
      <AnchorPicker
        size="sm"
        label={TRANSFORM_BAR_TEXT.pivot}
        value={anchor ?? 'center'}
        disabled={model.spec.corners !== null}
        onChange={(next) => reviseTransform((spec) => presetPivot(model.box, spec, next))}
      />
      {anchor === null && <Text as="span" variant="caption">{TRANSFORM_BAR_TEXT.pivotCustom}</Text>}
    </Field>
  );
};

export { PivotField };
