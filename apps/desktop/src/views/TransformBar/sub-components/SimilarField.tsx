/* @layer renderer-app @kind component */
import { NumberField as ScrubField } from '@drizztdourden08/tessera';
import { reviseTransform } from '../../../editor/transform/revise-transform';
import { SIMILAR_RANGE, TRANSFORM_BAR_TEXT } from '../TransformBar.constants';
import type { ChoiceFieldsProps } from '../TransformBar.type';

const clampSimilar = (value: number): number => Math.max(SIMILAR_RANGE.min, Math.min(SIMILAR_RANGE.max, Math.round(value)));

const SimilarField = ({ model }: ChoiceFieldsProps) => (
  <ScrubField
    className="transform-bar__number"
    size="sm"
    scrub
    label={TRANSFORM_BAR_TEXT.similar}
    aria-label={TRANSFORM_BAR_TEXT.similar}
    title={TRANSFORM_BAR_TEXT.similarHint}
    min={SIMILAR_RANGE.min}
    max={SIMILAR_RANGE.max}
    step={1}
    value={model.spec.similar ?? 0}
    onChange={(next) => reviseTransform((current) => ({ ...current, similar: clampSimilar(next) }))}
  />
);

export { SimilarField };
