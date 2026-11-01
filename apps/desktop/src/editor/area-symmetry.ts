/* @layer renderer-app @kind logic */
import type { Size, Symmetry } from '@bxel/raster';
import { useDrawingStore } from '../stores/useDrawingStore';
import { clampAxis } from './clamp-axis';
import { crossingSymmetry } from './crossing-symmetry';
import type { SymmetryFields } from './editor.type';

const areaSymmetry = (settings: SymmetryFields, size: Size): Symmetry => {
  const { symmetryDiagonal, symmetryTurn } = useDrawingStore.getState();
  if (symmetryDiagonal || symmetryTurn) return crossingSymmetry(settings, size, { diagonal: symmetryDiagonal, turn: symmetryTurn });
  return {
    ...(settings.symmetryX ? { x2: clampAxis(settings.axisX, size.width) } : {}),
    ...(settings.symmetryY ? { y2: clampAxis(settings.axisY, size.height) } : {}),
  };
};

export { areaSymmetry };
