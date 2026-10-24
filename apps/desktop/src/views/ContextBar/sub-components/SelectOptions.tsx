/* @layer renderer-app @kind component */
import { Button, Flex } from '@drizztdourden08/tessera';
import { resizeSelection } from '../../../editor/selection/resize-selection';
import { MODE_LABELS, SELECT_LABELS, SELECT_MODES, SELECT_VARIANTS } from '../../../editor/selection/selection.constants';
import { CONNECTIVITIES } from '../../../editor/tools.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { ActionHint } from '../../ActionHint';
import { HintedSegments } from '../../HintedSegments';
import {
  CONTEXT_TEXT, EXPAND_HINT, NEIGHBOUR_CHOICES, NEIGHBOUR_HINTS, SELECT_MODE_HINTS, SELECT_VARIANT_HINTS, SHRINK_HINT,
} from '../ContextBar.constants';

const SelectOptions = () => {
  const variant = useSelectionStore((state) => state.variant);
  const mode = useSelectionStore((state) => state.mode);
  const connectivity = useSelectionStore((state) => state.connectivity);
  const setVariant = useSelectionStore((state) => state.setVariant);
  const setMode = useSelectionStore((state) => state.setMode);
  const setConnectivity = useSelectionStore((state) => state.setConnectivity);
  return (
    <Flex wrap gap="sm" align="center">
      <HintedSegments
        label={CONTEXT_TEXT.selectVariant}
        value={variant}
        options={SELECT_VARIANTS.map((each) => ({ value: each, label: SELECT_LABELS[each], hint: SELECT_VARIANT_HINTS[each] }))}
        onChange={setVariant}
      />
      <HintedSegments
        label={CONTEXT_TEXT.selectMode}
        value={mode}
        options={SELECT_MODES.map((each) => ({ value: each, label: MODE_LABELS[each], hint: SELECT_MODE_HINTS[each] }))}
        onChange={setMode}
      />
      {variant === 'wand' && (
        <HintedSegments
          label={CONTEXT_TEXT.wandNeighbours}
          value={NEIGHBOUR_CHOICES[connectivity]}
          options={CONNECTIVITIES.map((each) => ({ value: NEIGHBOUR_CHOICES[each], label: NEIGHBOUR_CHOICES[each], hint: NEIGHBOUR_HINTS[each] }))}
          onChange={(choice) => setConnectivity(choice === NEIGHBOUR_CHOICES[8] ? 8 : 4)}
        />
      )}
      <ActionHint hint={EXPAND_HINT}>
        <Button size="xs" variant="tertiary" onClick={() => resizeSelection(1)}>{CONTEXT_TEXT.expand}</Button>
      </ActionHint>
      <ActionHint hint={SHRINK_HINT}>
        <Button size="xs" variant="tertiary" onClick={() => resizeSelection(-1)}>{CONTEXT_TEXT.shrink}</Button>
      </ActionHint>
    </Flex>
  );
};

export { SelectOptions };
