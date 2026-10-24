/* @layer renderer-app @kind component */
import { Checkbox, Flex } from '@drizztdourden08/tessera';
import { SHAPE_KINDS, SHAPE_LABELS } from '../../../editor/tools.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { ActionHint } from '../../ActionHint';
import { HintedSegments } from '../../HintedSegments';
import { CONTEXT_TEXT, FILLED_HINT, SHAPE_HINTS } from '../ContextBar.constants';

const ShapeOptions = () => {
  const shape = useToolStore((state) => state.shape);
  const filled = useToolStore((state) => state.filled);
  const setShape = useToolStore((state) => state.setShape);
  const setFilled = useToolStore((state) => state.setFilled);
  return (
    <Flex gap="sm" align="center">
      <HintedSegments
        label={CONTEXT_TEXT.shapeKind}
        value={shape}
        options={SHAPE_KINDS.map((each) => ({ value: each, label: SHAPE_LABELS[each], hint: SHAPE_HINTS[each] }))}
        onChange={setShape}
      />
      <ActionHint hint={FILLED_HINT}>
        <Checkbox size="sm" label={CONTEXT_TEXT.filled} checked={filled} disabled={shape === 'line'} onChange={setFilled} />
      </ActionHint>
    </Flex>
  );
};

export { ShapeOptions };
