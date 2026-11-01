/* @layer renderer-app @kind logic */
import { drawShape } from '@bxel/raster';
import type { Size } from '@bxel/raster';
import type { ToolSettings } from '../../stores/tool-store.type';
import { useDrawingStore } from '../../stores/useDrawingStore';
import { brushOf } from '../brush-of';
import { symmetryOf } from '../symmetry-of';
import { PAINTED } from './quick-mask.constants';
import type { QuickShape } from './stamp-quick-shape.type';

const stampQuickShape = (scratch: Uint8Array, size: Size, quick: QuickShape, settings: ToolSettings): void => {
  const { shape, corners } = quick;
  const drawing = useDrawingStore.getState();
  drawShape({
    target: { pixels: scratch, width: size.width, height: size.height },
    index: PAINTED,
    shape,
    from: corners.from,
    to: corners.to,
    filled: shape !== 'line' && drawing.filled[shape],
    radius: shape === 'rect' ? drawing.cornerRadius : 0,
    evenSteps: shape === 'line' && drawing.evenSteps,
    brush: brushOf(settings),
    symmetry: symmetryOf(settings, size),
  });
};

export { stampQuickShape };
