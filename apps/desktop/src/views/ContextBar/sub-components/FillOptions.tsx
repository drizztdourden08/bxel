/* @layer renderer-app @kind component */
import { Flex } from '@drizztdourden08/tessera';
import { CONNECTIVITIES, FILL_LABELS, FILL_MODES } from '../../../editor/tools.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { HintedSegments } from '../../HintedSegments';
import { CONTEXT_TEXT, FILL_HINTS, NEIGHBOUR_CHOICES, NEIGHBOUR_HINTS } from '../ContextBar.constants';

const FillOptions = () => {
  const mode = useToolStore((state) => state.fillMode);
  const connectivity = useToolStore((state) => state.connectivity);
  const setMode = useToolStore((state) => state.setFillMode);
  const setConnectivity = useToolStore((state) => state.setConnectivity);
  return (
    <Flex gap="sm" align="center">
      <HintedSegments
        label={CONTEXT_TEXT.fillMode}
        value={mode}
        options={FILL_MODES.map((each) => ({ value: each, label: FILL_LABELS[each], hint: FILL_HINTS[each] }))}
        onChange={setMode}
      />
      <HintedSegments
        label={CONTEXT_TEXT.neighbours}
        value={NEIGHBOUR_CHOICES[connectivity]}
        options={CONNECTIVITIES.map((each) => ({ value: NEIGHBOUR_CHOICES[each], label: NEIGHBOUR_CHOICES[each], hint: NEIGHBOUR_HINTS[each] }))}
        onChange={(choice) => setConnectivity(choice === NEIGHBOUR_CHOICES[8] ? 8 : 4)}
      />
    </Flex>
  );
};

export { FillOptions };
