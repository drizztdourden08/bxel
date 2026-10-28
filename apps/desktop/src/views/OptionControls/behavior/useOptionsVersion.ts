/* @layer renderer-app @kind hook */
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';

const useOptionsVersion = (): string => {
  const tool = useToolStore((state) => `${state.tool}|${state.brushSize}|${state.brushShape}|${state.pixelPerfect}|${state.fillMode}|${state.connectivity}|${state.shape}|${state.filled}`);
  const selection = useSelectionStore((state) => `${state.variant}|${state.mode}|${state.connectivity}`);
  const map = useTilemapStore((state) => `${JSON.stringify(state.flags)}|${state.filled}|${state.terrainBrush}|${state.selection !== null}`);
  return `${tool}|${selection}|${map}`;
};

export { useOptionsVersion };
