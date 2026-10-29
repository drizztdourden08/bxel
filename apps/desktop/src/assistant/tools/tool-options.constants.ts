/* @layer renderer-app @kind constants */
import type { FilledTool } from '../../stores/drawing-store.type';
import { useToolStore } from '../../stores/useToolStore';
import { useDrawingStore } from '../../stores/useDrawingStore';
import type { OptionSetter } from './tool-options.type';

const FILLED: readonly string[] = ['rect', 'ellipse', 'curve', 'polygon', 'contour'];

const TOOL_OPTION_SETTERS: readonly OptionSetter[] = [
  (store, options) => {
    if (options.brushSize !== undefined) store.setBrushSize(options.brushSize);
  },
  (store, options) => {
    if (options.brushShape !== undefined) store.setBrushShape(options.brushShape);
  },
  (store, options) => {
    if (options.brushAngle !== undefined) store.setBrushAngle(options.brushAngle);
  },
  (store, options) => {
    if (options.pixelPerfect !== undefined) store.setPixelPerfect(options.pixelPerfect);
  },
  (store, options) => {
    if (options.fillMode !== undefined) store.setFillMode(options.fillMode);
  },
  (store, options) => {
    if (options.connectivity !== undefined) store.setConnectivity(options.connectivity);
  },
  (_store, options) => {
    const { tool } = useToolStore.getState();
    if (options.filled !== undefined && FILLED.includes(tool)) useDrawingStore.getState().setFilled(tool as FilledTool, options.filled);
  },
  (_store, options) => {
    if (options.ink !== undefined) useDrawingStore.getState().setInk(useToolStore.getState().tool, options.ink);
  },
];

export { TOOL_OPTION_SETTERS };
