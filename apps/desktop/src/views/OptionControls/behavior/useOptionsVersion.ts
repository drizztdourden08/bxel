/* @layer renderer-app @kind hook */
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { drawingVersion } from '../../../stores/drawing-version';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useToolStore } from '../../../stores/useToolStore';

const useOptionsVersion = (): string => {
  const tool = useToolStore((state) => `${state.tool}|${state.brushSize}|${state.brushShape}|${state.brushAngle}|${state.pixelPerfect}|${state.symmetryX}|${state.symmetryY}|${state.fillMode}|${state.connectivity}`);
  const drawing = useDrawingStore(drawingVersion);
  const selection = useSelectionStore((state) => `${state.variant}|${state.mode}|${state.connectivity}`);
  const map = useTilemapStore((state) => `${JSON.stringify(state.flags)}|${state.filled}|${state.terrainBrush}|${state.selection !== null}`);
  return `${tool}|${selection}|${map}|${drawing}`;
};

export { useOptionsVersion };
