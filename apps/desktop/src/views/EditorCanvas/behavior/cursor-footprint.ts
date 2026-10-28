/* @layer renderer-app @kind logic */
import type { ToolSettings } from '../../../stores/tool-store.type';
import { useDrawingStore } from '../../../stores/useDrawingStore';

const cursorFootprint = (tools: Pick<ToolSettings, 'tool' | 'brushSize'>): number => {
  if (tools.tool === 'pencil' || tools.tool === 'eraser' || tools.tool === 'line' || tools.tool === 'curve') return tools.brushSize;
  if (tools.tool === 'spray') return useDrawingStore.getState().spraySize;
  if (tools.tool === 'rect' || tools.tool === 'ellipse' || tools.tool === 'contour' || tools.tool === 'polygon') return tools.brushSize;
  return tools.tool === 'zoom' || tools.tool === 'hand' ? 0 : 1;
};

export { cursorFootprint };
