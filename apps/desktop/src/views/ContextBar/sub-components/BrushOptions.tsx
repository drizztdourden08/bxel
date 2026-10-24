/* @layer renderer-app @kind component */
import { Flex, NumberInput, SegmentedControl } from '@drizztdourden08/tessera';
import type { BrushShape } from '@bxel/raster';
import { BRUSH_SIZE } from '../../../stores/tool-store.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { ActionHint, segmentOption } from '../../ActionHint';
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
      <SegmentedControl<BrushShape>
        size="sm"
        aria-label={CONTEXT_TEXT.brushShape}
        value={shape}
        options={BRUSH_SHAPES.map((each) =>
          segmentOption({ value: each, label: each === 'square' ? CONTEXT_TEXT.square : CONTEXT_TEXT.circle, hint: BRUSH_SHAPE_HINTS[each] }),
        )}
        onChange={setShape}
      />
    </Flex>
  );
};

export { BrushOptions };
