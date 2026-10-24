/* @layer renderer-app @kind component */
import { Button, Flex, SegmentedControl } from '@drizztdourden08/tessera';
import { resizeSelection } from '../../../editor/selection/resize-selection';
import { MODE_LABELS, SELECT_LABELS, SELECT_MODES, SELECT_VARIANTS } from '../../../editor/selection/selection.constants';
import { CONNECTIVITIES } from '../../../editor/tools.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { CONTEXT_TEXT, NEIGHBOUR_CHOICES } from '../ContextBar.constants';

const SelectOptions = () => {
  const variant = useSelectionStore((state) => state.variant);
  const mode = useSelectionStore((state) => state.mode);
  const connectivity = useSelectionStore((state) => state.connectivity);
  const setVariant = useSelectionStore((state) => state.setVariant);
  const setMode = useSelectionStore((state) => state.setMode);
  const setConnectivity = useSelectionStore((state) => state.setConnectivity);
  return (
    <Flex wrap gap="sm" align="center">
      <SegmentedControl
        size="sm"
        aria-label={CONTEXT_TEXT.selectVariant}
        value={variant}
        options={SELECT_VARIANTS.map((each) => ({ value: each, label: SELECT_LABELS[each] }))}
        onChange={setVariant}
      />
      <SegmentedControl
        size="sm"
        aria-label={CONTEXT_TEXT.selectMode}
        value={mode}
        options={SELECT_MODES.map((each) => ({ value: each, label: MODE_LABELS[each] }))}
        onChange={setMode}
      />
      {variant === 'wand' && (
        <SegmentedControl
          size="sm"
          aria-label={CONTEXT_TEXT.wandNeighbours}
          value={NEIGHBOUR_CHOICES[connectivity]}
          options={CONNECTIVITIES.map((each) => ({ value: NEIGHBOUR_CHOICES[each], label: NEIGHBOUR_CHOICES[each] }))}
          onChange={(choice) => setConnectivity(choice === NEIGHBOUR_CHOICES[8] ? 8 : 4)}
        />
      )}
      <Button size="xs" variant="tertiary" onClick={() => resizeSelection(1)}>{CONTEXT_TEXT.expand}</Button>
      <Button size="xs" variant="tertiary" onClick={() => resizeSelection(-1)}>{CONTEXT_TEXT.shrink}</Button>
    </Flex>
  );
};

export { SelectOptions };
