/* @layer renderer-app @kind component */
import { ControlMenuRow, Toggle } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import type { OnionToggleRowProps } from './OnionChoiceRow.type';

const OnionToggleRow = ({ field, label }: OnionToggleRowProps) => {
  const checked = useTimelineStore((state) => state.onion[field]);
  const setOnion = useTimelineStore((state) => state.setOnion);
  return (
    <ControlMenuRow label={label}>
      <Toggle size="sm" aria-label={label} checked={checked} onChange={(next) => setOnion({ [field]: next })} />
    </ControlMenuRow>
  );
};

export { OnionToggleRow };
