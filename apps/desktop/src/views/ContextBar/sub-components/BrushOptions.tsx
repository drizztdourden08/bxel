/* @layer renderer-app @kind component */
import { Flex, NumberInput } from '@drizztdourden08/tessera';
import { BRUSH_SIZE } from '../../../stores/tool-store.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { ActionHint } from '../../ActionHint';
import { HintedSegments } from '../../HintedSegments';
import { BRUSH_SHAPE_HINTS, BRUSH_SHAPES, BRUSH_SIZE_HINT, CONTEXT_TEXT } from '../ContextBar.constants';

const BrushOptions = () => {
  const size = useToolStore((state) => state.brushSize);
  const shape = useToolStore((state) => state.brushShape);
  const setSize = useToolStore((state) => state.setBrushSize);
  const setShape = useToolStore((state) => state.setBrushShape);
  return (
    <Flex gap="sm" align="center">
      <ActionHint hint={BRUSH_SIZE_HINT}>
        <NumberInput
          size="sm"
          sizeToContent
          min={BRUSH_SIZE.min}
          max={BRUSH_SIZE.max}
          step={1}
          value={size}
          aria-label={CONTEXT_TEXT.size}
          onChange={setSize}
        />
      </ActionHint>
      <HintedSegments
        label={CONTEXT_TEXT.brushShape}
        value={shape}
        options={BRUSH_SHAPES.map((each) => ({
          value: each,
          label: each === 'square' ? CONTEXT_TEXT.square : CONTEXT_TEXT.circle,
          hint: BRUSH_SHAPE_HINTS[each],
        }))}
        onChange={setShape}
      />
    </Flex>
  );
};

export { BrushOptions };
