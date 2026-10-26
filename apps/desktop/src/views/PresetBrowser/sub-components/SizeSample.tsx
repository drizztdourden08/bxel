/* @layer renderer-app @kind component */
import { Canvas, Stack, Text } from '@drizztdourden08/tessera';
import { useCallback } from 'react';
import type { SampleSprite } from '../../../canvas-look/canvas-look.type';
import { paintSampleSprite } from '../../../canvas-look/paint-sample-sprite';
import { useCanvasLook } from '../../../canvas-look/useCanvasLook';
import { usePaintedCanvas } from '../../../hooks/usePaintedCanvas';
import { PREVIEW_TEXT } from '../../../platform-preset/preset-facts.constants';
import { pairText } from '../../../platform-preset/pair-text';
import './SizeSample.css';

const SizeSample = ({ sample }: { sample: SampleSprite }) => {
  const look = useCanvasLook();
  const draw = useCallback((canvas: HTMLCanvasElement) => paintSampleSprite(canvas, sample, look), [sample, look]);
  const ref = usePaintedCanvas(draw);
  return (
    <Stack gap="xs" align="center">
      <Canvas ref={ref} className="preset-browser__sample" role="img" aria-label={PREVIEW_TEXT.sampleLabel(sample.size[0], sample.size[1])} />
      <Text variant="caption" tone="muted">
        {pairText(sample.size)}
      </Text>
    </Stack>
  );
};

export { SizeSample };
