/* @layer renderer-app @kind component */
import { Checkbox, Flex, SegmentedControl } from '@drizztdourden08/tessera';
import { SHAPE_KINDS, SHAPE_LABELS } from '../../../editor/tools.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { CONTEXT_TEXT } from '../ContextBar.constants';

const ShapeOptions = () => {
  const shape = useToolStore((state) => state.shape);
  const filled = useToolStore((state) => state.filled);
  const setShape = useToolStore((state) => state.setShape);
  const setFilled = useToolStore((state) => state.setFilled);
  return (
    <Flex gap="sm" align="center">
      <SegmentedControl
        size="sm"
        aria-label={CONTEXT_TEXT.shapeKind}
        value={shape}
        options={SHAPE_KINDS.map((each) => ({ value: each, label: SHAPE_LABELS[each] }))}
        onChange={setShape}
      />
      <Checkbox size="sm" label={CONTEXT_TEXT.filled} checked={filled} disabled={shape === 'line'} onChange={setFilled} />
    </Flex>
  );
};

export { ShapeOptions };
