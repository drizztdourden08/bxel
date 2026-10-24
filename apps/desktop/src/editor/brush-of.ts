/* @layer renderer-app @kind logic */
import type { Brush } from '@bxel/raster';
import type { ToolSettings } from '../stores/tool-store.type';

const brushOf = (settings: Pick<ToolSettings, 'brushSize' | 'brushShape'>): Brush => ({
  shape: settings.brushShape,
  size: settings.brushSize,
});

export { brushOf };
