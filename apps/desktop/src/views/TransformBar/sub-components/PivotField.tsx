/* @layer renderer-app @kind component */
import { Field, Select } from '@drizztdourden08/tessera';
import { anchorOfPivot } from '../../../editor/transform/anchor-of-pivot';
import { ANCHORS } from '../../../editor/transform/pivot-preset.constants';
import { presetPivot } from '../../../editor/transform/preset-pivot';
import { reviseTransform } from '../../../editor/transform/revise-transform';
import { ANCHOR_LABELS, CUSTOM_PIVOT, TRANSFORM_BAR_TEXT } from '../TransformBar.constants';
import type { PivotFieldProps } from '../TransformBar.type';

const PivotField = ({ model }: PivotFieldProps) => {
  const anchor = anchorOfPivot(model.box, model.spec);
  const options = [
    ...ANCHORS.map((each) => ({ value: each, label: ANCHOR_LABELS[each] })),
    { value: CUSTOM_PIVOT, label: TRANSFORM_BAR_TEXT.pivotCustom, disabled: true },
  ];
  return (
    <Field label={TRANSFORM_BAR_TEXT.pivot} inline size="sm">
      <Select
        size="sm"
        aria-label={TRANSFORM_BAR_TEXT.pivot}
        options={options}
        value={anchor ?? CUSTOM_PIVOT}
        disabled={model.spec.corners !== null}
        onChange={(next) => {
          const found = ANCHORS.find((each) => each === next);
          if (found) reviseTransform((spec) => presetPivot(model.box, spec, found));
        }}
      />
    </Field>
  );
};

export { PivotField };
