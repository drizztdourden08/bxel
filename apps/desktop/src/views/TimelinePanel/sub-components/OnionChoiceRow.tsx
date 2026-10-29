/* @layer renderer-app @kind component */
import { ControlMenuRow, SegmentedControl } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import type { OnionChoiceKey, OnionChoiceRowProps } from './OnionChoiceRow.type';

const OnionChoiceRow = <K extends OnionChoiceKey>({ field, label, order, names }: OnionChoiceRowProps<K>) => {
  const value = useTimelineStore((state) => state.onion[field]);
  const setOnion = useTimelineStore((state) => state.setOnion);
  return (
    <ControlMenuRow label={label}>
      <SegmentedControl
        size="sm"
        aria-label={label}
        value={value}
        options={order.map((each) => ({ value: each, label: names[each] }))}
        onChange={(next) => setOnion({ [field]: next })}
      />
    </ControlMenuRow>
  );
};

export { OnionChoiceRow };
