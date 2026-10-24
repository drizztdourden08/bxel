/* @layer renderer-app @kind component */
import type { CombineMode } from '@bxel/raster';
import { Button, Flex, SegmentedControl } from '@drizztdourden08/tessera';
import { resizeSelection } from '../../../editor/selection/resize-selection';
import { MODE_LABELS, SELECT_LABELS, SELECT_MODES, SELECT_VARIANTS } from '../../../editor/selection/selection.constants';
import type { SelectVariant } from '../../../editor/selection/selection.type';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { ActionHint, segmentOption } from '../../ActionHint';
import { CONTEXT_TEXT, EXPAND_HINT, SELECT_MODE_HINTS, SELECT_VARIANT_HINTS, SHRINK_HINT } from '../ContextBar.constants';
import { NeighbourChoice } from './NeighbourChoice';

const SelectOptions = () => {
  const variant = useSelectionStore((state) => state.variant);
  const mode = useSelectionStore((state) => state.mode);
  const connectivity = useSelectionStore((state) => state.connectivity);
  const setVariant = useSelectionStore((state) => state.setVariant);
  const setMode = useSelectionStore((state) => state.setMode);
  const setConnectivity = useSelectionStore((state) => state.setConnectivity);
  return (
    <Flex wrap gap="sm" align="center">
      <SegmentedControl<SelectVariant>
        size="sm"
        aria-label={CONTEXT_TEXT.selectVariant}
        value={variant}
        options={SELECT_VARIANTS.map((each) => segmentOption({ value: each, label: SELECT_LABELS[each], hint: SELECT_VARIANT_HINTS[each] }))}
        onChange={setVariant}
      />
      <SegmentedControl<CombineMode>
        size="sm"
        aria-label={CONTEXT_TEXT.selectMode}
        value={mode}
        options={SELECT_MODES.map((each) => segmentOption({ value: each, label: MODE_LABELS[each], hint: SELECT_MODE_HINTS[each] }))}
        onChange={setMode}
      />
      {variant === 'wand' && <NeighbourChoice label={CONTEXT_TEXT.wandNeighbours} value={connectivity} onChange={setConnectivity} />}
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
