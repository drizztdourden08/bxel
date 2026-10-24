/* @layer renderer-app @kind component */
import { Flex, NumberInput, SegmentedControl } from '@drizztdourden08/tessera';
import { BRUSH_SIZE } from '../../../stores/tool-store.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { BRUSH_SHAPES, CONTEXT_TEXT } from '../ContextBar.constants';

const BrushOptions = () => {
  const size = useToolStore((state) => state.brushSize);
  const shape = useToolStore((state) => state.brushShape);
  const setSize = useToolStore((state) => state.setBrushSize);
  const setShape = useToolStore((state) => state.setBrushShape);
  return (
    <Flex gap="sm" align="center">
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
      <SegmentedControl
        size="sm"
        aria-label={CONTEXT_TEXT.brushShape}
        value={shape}
        options={BRUSH_SHAPES.map((each) => ({ value: each, label: each === 'square' ? CONTEXT_TEXT.square : CONTEXT_TEXT.circle }))}
        onChange={setShape}
      />
    </Flex>
  );
};

export { BrushOptions };
