/* @layer renderer-app @kind component */
import { brushStamp } from '@bxel/raster';
import { Canvas } from '@drizztdourden08/tessera';
import { useCallback } from 'react';
import { usePaintedCanvas } from '../../../hooks/usePaintedCanvas';
import { OPTION_CONTROLS_TEXT, PREVIEW_CELLS } from '../OptionControls.constants';
import type { BrushPreviewProps } from '../OptionControls.type';

const BrushPreview = ({ size, shape, small = false }: BrushPreviewProps) => {
  const draw = useCallback(
    (canvas: HTMLCanvasElement) => {
      const stamp = brushStamp({ size: Math.min(size, PREVIEW_CELLS), shape });
      const cells = Math.max(stamp.size, PREVIEW_CELLS);
      canvas.width = cells;
      canvas.height = cells;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.clearRect(0, 0, cells, cells);
      context.fillStyle = getComputedStyle(canvas).color;
      const origin = Math.floor((cells - stamp.size) / 2);
      for (let row = 0; row < stamp.size; row++) {
        for (let col = 0; col < stamp.size; col++) {
          if (stamp.cells[row * stamp.size + col] === 1) context.fillRect(origin + col, origin + row, 1, 1);
        }
      }
    },
    [size, shape],
  );
  const ref = usePaintedCanvas(draw);
  return <Canvas ref={ref} className="option-preview" data-size={small ? 'small' : undefined} role="img" aria-label={OPTION_CONTROLS_TEXT.previewLabel(size, shape)} />;
};

export { BrushPreview };
