/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera';
import type { SegmentOption } from '@drizztdourden08/tessera';
import { ActionHint, hintOf, useChoiceHint } from '../ActionHint';
import type { HintedSegmentsProps } from './HintedSegments.type';

const HintedSegments = <T extends string>({ label, value, options, onChange }: HintedSegmentsProps<T>) => {
  const choice = useChoiceHint(options.map((each) => each.hint));
  const segments = options.map((each): SegmentOption<T> => ({ value: each.value, label: each.label, disabled: each.disabled, hint: hintOf(each.hint) }));
  return (
    <ActionHint hint={choice.spec}>
      <SegmentedControl<T> size="sm" aria-label={label} value={value} options={segments} onHint={choice.onHint} onChange={onChange} />
    </ActionHint>
  );
};

export { HintedSegments };
