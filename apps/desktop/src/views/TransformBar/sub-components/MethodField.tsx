/* @layer renderer-app @kind component */
import { ALGORITHM_LABELS, ALGORITHM_NOTES } from '@bxel/raster';
import { Field, SegmentedControl, Text } from '@drizztdourden08/tessera';
import { reviseTransform } from '../../../editor/transform/revise-transform';
import { BOUNDS_BAR_LABELS, METHOD_CHOICES, TRANSFORM_BAR_TEXT } from '../TransformBar.constants';
import type { MethodFieldProps } from '../TransformBar.type';
import { BOUNDS_CHOICES } from '../../../editor/pending/pending.constants';

const MethodField = ({ model }: MethodFieldProps) => (
  <>
    <Field label={TRANSFORM_BAR_TEXT.method} inline size="sm">
      <SegmentedControl
        size="sm"
        aria-label={TRANSFORM_BAR_TEXT.methodName}
        value={model.spec.algorithm}
        options={METHOD_CHOICES.map((each) => ({ value: each, label: ALGORITHM_LABELS[each] }))}
        onChange={(algorithm) => reviseTransform((spec) => ({ ...spec, algorithm }))}
      />
    </Field>
    <Field label={TRANSFORM_BAR_TEXT.bounds} inline size="sm">
      <SegmentedControl
        size="sm"
        aria-label={TRANSFORM_BAR_TEXT.boundsName}
        value={model.spec.bounds}
        options={BOUNDS_CHOICES.map((each) => ({ value: each, label: BOUNDS_BAR_LABELS[each] }))}
        onChange={(bounds) => reviseTransform((spec) => ({ ...spec, bounds }))}
      />
    </Field>
    <Text as="span" variant="caption" className="transform-bar__note">{ALGORITHM_NOTES[model.spec.algorithm]}</Text>
  </>
);

export { MethodField };
