/* @layer renderer-app @kind component */
import type { ShapeKind } from '@bxel/raster';
import { Checkbox, Flex, SegmentedControl } from '@drizztdourden08/tessera';
import { SHAPE_KINDS, SHAPE_LABELS } from '../../../editor/tools.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { ActionHint, segmentOption } from '../../ActionHint';
import { CONTEXT_TEXT, FILLED_HINT, SHAPE_HINTS } from '../ContextBar.constants';

const ShapeOptions = () => {
  const shape = useToolStore((state) => state.shape);
  const filled = useToolStore((state) => state.filled);
  const setShape = useToolStore((state) => state.setShape);
  const setFilled = useToolStore((state) => state.setFilled);
  return (
    <Flex gap="sm" align="center">
      <SegmentedControl<ShapeKind>
        size="sm"
        aria-label={CONTEXT_TEXT.shapeKind}
        value={shape}
        options={SHAPE_KINDS.map((each) => segmentOption({ value: each, label: SHAPE_LABELS[each], hint: SHAPE_HINTS[each] }))}
        onChange={setShape}
      />
      <ActionHint hint={FILLED_HINT}>
        <Checkbox size="sm" label={CONTEXT_TEXT.filled} checked={filled} disabled={shape === 'line'} onChange={setFilled} />
      </ActionHint>
    </Flex>
  );
};

export { ShapeOptions };
