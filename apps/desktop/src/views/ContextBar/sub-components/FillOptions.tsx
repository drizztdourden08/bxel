/* @layer renderer-app @kind component */
import { Flex, SegmentedControl } from '@drizztdourden08/tessera';
import { CONNECTIVITIES, FILL_LABELS, FILL_MODES } from '../../../editor/tools.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { CONTEXT_TEXT, NEIGHBOUR_CHOICES } from '../ContextBar.constants';

const FillOptions = () => {
  const mode = useToolStore((state) => state.fillMode);
  const connectivity = useToolStore((state) => state.connectivity);
  const setMode = useToolStore((state) => state.setFillMode);
  const setConnectivity = useToolStore((state) => state.setConnectivity);
  return (
    <Flex gap="sm" align="center">
      <SegmentedControl
        size="sm"
        aria-label={CONTEXT_TEXT.fillMode}
        value={mode}
        options={FILL_MODES.map((each) => ({ value: each, label: FILL_LABELS[each] }))}
        onChange={setMode}
      />
      <SegmentedControl
        size="sm"
        aria-label={CONTEXT_TEXT.neighbours}
        value={NEIGHBOUR_CHOICES[connectivity]}
        options={CONNECTIVITIES.map((each) => ({ value: NEIGHBOUR_CHOICES[each], label: NEIGHBOUR_CHOICES[each] }))}
        onChange={(choice) => setConnectivity(choice === NEIGHBOUR_CHOICES[8] ? 8 : 4)}
      />
    </Flex>
  );
};

export { FillOptions };
