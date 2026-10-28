/* @layer renderer-app @kind constants */
import type { OptionSetter } from './tool-options.type';

const TOOL_OPTION_SETTERS: readonly OptionSetter[] = [
  (store, options) => {
    if (options.brushSize !== undefined) store.setBrushSize(options.brushSize);
  },
  (store, options) => {
    if (options.brushShape !== undefined) store.setBrushShape(options.brushShape);
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
  (store, options) => {
    if (options.shape !== undefined) store.setShape(options.shape);
  },
  (store, options) => {
    if (options.filled !== undefined) store.setFilled(options.filled);
  },
];

export { TOOL_OPTION_SETTERS };
