/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { clampBrushSize } from '../editor/clamp-brush-size';
import { toolChange } from '../editor/tool-change';
import { TOOL_DEFAULTS } from './tool-store.constants';
import type { ToolState } from './tool-store.type';

const useToolStore = create<ToolState>()((set) => ({
  ...TOOL_DEFAULTS,
  selectTool: (tool) => set((state) => toolChange(state, tool)),
  setForeground: (foreground) => set({ foreground }),
  setBackground: (background) => set({ background }),
  setColour: (slot, index) => set({ [slot]: index }),
  swapPairs: () =>
    set((state) => ({ foreground: state.third, background: state.fourth, third: state.foreground, fourth: state.background })),
  swapColors: () => set((state) => ({ foreground: state.background, background: state.foreground })),
  setLayer: (layerId) => set({ layerId }),
  setBrushSize: (size) => set({ brushSize: clampBrushSize(size) }),
  stepBrushSize: (delta) => set((state) => ({ brushSize: clampBrushSize(state.brushSize + delta) })),
  setBrushShape: (brushShape) => set({ brushShape }),
  setPixelPerfect: (pixelPerfect) => set({ pixelPerfect }),
  setFillMode: (fillMode) => set({ fillMode }),
  setConnectivity: (connectivity) => set({ connectivity }),
  setShape: (shape) => set({ shape }),
  setFilled: (filled) => set({ filled }),
  toggleSymmetry: (axis) => set((state) => (axis === 'x' ? { symmetryX: !state.symmetryX } : { symmetryY: !state.symmetryY })),
  setAxis: (axis, doubled) => set(axis === 'x' ? { axisX: doubled } : { axisY: doubled }),
  setLastPoint: (lastPoint) => set({ lastPoint }),
}));

export { useToolStore };
