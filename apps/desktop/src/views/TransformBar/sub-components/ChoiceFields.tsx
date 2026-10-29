/* @layer renderer-app @kind component */
import { SegmentedControl, Select } from '@drizztdourden08/tessera';
import { reviseTransform } from '../../../editor/transform/revise-transform';
import { METHOD_CHOICES, TRANSFORM_BAR_TEXT } from '../TransformBar.constants';
import type { ChoiceFieldsProps } from '../TransformBar.type';
import { BOUNDS_OPTIONS, METHOD_OPTIONS } from './ChoiceFields.constants';

const ChoiceFields = ({ model }: ChoiceFieldsProps) => (
  <>
    <Select
      size="sm"
      width="fit"
      className="transform-bar__method"
      aria-label={TRANSFORM_BAR_TEXT.methodName}
      options={METHOD_OPTIONS}
      value={model.spec.algorithm}
      onChange={(value) => reviseTransform((current) => ({ ...current, algorithm: METHOD_CHOICES.find((each) => each === value) ?? current.algorithm }))}
    />
    <SegmentedControl
      size="sm"
      label={TRANSFORM_BAR_TEXT.boundsName}
      options={BOUNDS_OPTIONS}
      value={model.spec.bounds}
      onChange={(value) => reviseTransform((current) => ({ ...current, bounds: value === 'expand' ? 'expand' : 'crop' }))}
    />
  </>
);

export { ChoiceFields };
