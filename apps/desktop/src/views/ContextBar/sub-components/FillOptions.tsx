/* @layer renderer-app @kind component */
import type { FillMode } from '@bxel/raster';
import { Flex, SegmentedControl } from '@drizztdourden08/tessera';
import { FILL_LABELS, FILL_MODES } from '../../../editor/tools.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { segmentOption } from '../../ActionHint';
import { CONTEXT_TEXT, FILL_HINTS } from '../ContextBar.constants';
import { NeighbourChoice } from './NeighbourChoice';

const FillOptions = () => {
  const mode = useToolStore((state) => state.fillMode);
  const connectivity = useToolStore((state) => state.connectivity);
  const setMode = useToolStore((state) => state.setFillMode);
  const setConnectivity = useToolStore((state) => state.setConnectivity);
  return (
    <Flex gap="sm" align="center">
      <SegmentedControl<FillMode>
        size="sm"
        aria-label={CONTEXT_TEXT.fillMode}
        value={mode}
        options={FILL_MODES.map((each) => segmentOption({ value: each, label: FILL_LABELS[each], hint: FILL_HINTS[each] }))}
        onChange={setMode}
      />
      <NeighbourChoice label={CONTEXT_TEXT.neighbours} value={connectivity} onChange={setConnectivity} />
    </Flex>
  );
};

export { FillOptions };
