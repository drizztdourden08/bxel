/* @layer renderer-app @kind component */
import { SegmentedControl, Select } from '@drizztdourden08/tessera';
import { reviseTransform } from '../../../editor/transform/revise-transform';
import { settleAlgorithm } from '../../../editor/transform/settle-algorithm';
import { TRANSFORM_BAR_TEXT } from '../TransformBar.constants';
import type { ChoiceFieldsProps } from '../TransformBar.type';
import { BOUNDS_OPTIONS, methodChoices, methodOptions } from './ChoiceFields.constants';
import { SimilarField } from './SimilarField';

const boundsOf = (value: string): 'crop' | 'expand' | 'cancel' => (value === 'expand' || value === 'cancel' ? value : 'crop');

const ChoiceFields = ({ model }: ChoiceFieldsProps) => {
  const spec = settleAlgorithm(model.spec);
  return (
    <>
      <Select
        size="sm"
        width="fit"
        className="transform-bar__method"
        aria-label={TRANSFORM_BAR_TEXT.methodName}
        options={methodOptions(spec)}
        value={spec.algorithm}
        onChange={(value) => {
          const choice = methodChoices(spec).find((each) => each === value);
          if (choice) reviseTransform((current) => ({ ...current, algorithm: choice }));
        }}
      />
      {spec.algorithm === 'rotsprite' && <SimilarField model={model} />}
      <SegmentedControl
        size="sm"
        label={TRANSFORM_BAR_TEXT.boundsName}
        options={BOUNDS_OPTIONS}
        value={spec.bounds}
        onChange={(value) => reviseTransform((current) => ({ ...current, bounds: boundsOf(value) }))}
      />
    </>
  );
};

export { ChoiceFields };
