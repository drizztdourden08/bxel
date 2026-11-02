/* @layer renderer-app @kind component */
import { SegmentedControl } from '@drizztdourden08/tessera';
import { useOnionPatternStore } from '../../../stores/useOnionPatternStore';
import { ONION_PATTERN_ORDER, ONION_TEXT as ONION_NAMES } from '../../../timeline/onion.constants';
import { ONION_TEXT } from '../ViewPanel.constants';

const OnionPatternField = () => {
  const pattern = useOnionPatternStore((state) => state.pattern);
  const setPattern = useOnionPatternStore((state) => state.setPattern);
  return (
    <SegmentedControl
      size="sm"
      label={ONION_TEXT.pattern}
      value={pattern}
      options={ONION_PATTERN_ORDER.map((each) => ({ value: each, label: ONION_NAMES.patterns[each] }))}
      onChange={setPattern}
    />
  );
};

export { OnionPatternField };
