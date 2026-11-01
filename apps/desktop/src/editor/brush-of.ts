/* @layer renderer-app @kind logic */
import type { Brush } from '@bxel/raster';
import type { ToolSettings } from '../stores/tool-store.type';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';

/** The tip of a stroke. The pencil stamps its saved brush itself; every other brush tool takes the saved brush as its tip. */
const brushOf = (settings: Pick<ToolSettings, 'brushSize' | 'brushShape' | 'brushAngle'>): Brush => {
  const drawing = useDrawingStore.getState();
  const spacing = drawing.brushSpacing > 1 ? { spacing: drawing.brushSpacing } : {};
  if (drawing.brushId !== null && useToolStore.getState().tool !== 'pencil') {
    return { shape: 'custom', size: settings.brushSize, brushId: drawing.brushId, ...spacing };
  }
  return {
    shape: settings.brushShape,
    size: settings.brushSize,
    ...(settings.brushShape === 'line' ? { angle: settings.brushAngle } : {}),
    ...spacing,
  };
};

export { brushOf };
