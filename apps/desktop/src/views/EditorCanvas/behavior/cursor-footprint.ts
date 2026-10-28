/* @layer renderer-app @kind logic */
import type { ToolSettings } from '../../../stores/tool-store.type';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { BRUSH_FOOTPRINT_TOOLS, NO_FOOTPRINT_TOOLS } from './cursor-footprint.constants';

const cursorFootprint = (tools: Pick<ToolSettings, 'tool' | 'brushSize'>): number => {
  if (BRUSH_FOOTPRINT_TOOLS.includes(tools.tool)) return tools.brushSize;
  if (tools.tool === 'spray') return useDrawingStore.getState().spraySize;
  return NO_FOOTPRINT_TOOLS.includes(tools.tool) ? 0 : 1;
};

export { cursorFootprint };
