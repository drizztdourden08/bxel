/* @layer renderer-app @kind logic */
import type { ToolSettings } from '../../../stores/tool-store.type';

const cursorFootprint = (tools: Pick<ToolSettings, 'tool' | 'brushSize'>): number => {
  if (tools.tool === 'pencil' || tools.tool === 'eraser') return tools.brushSize;
  return tools.tool === 'zoom' || tools.tool === 'hand' ? 0 : 1;
};

export { cursorFootprint };
