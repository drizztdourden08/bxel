/* @layer renderer-app @kind logic */
import type { Size, Symmetry } from '@bxel/raster';
import { useDrawingStore } from '../stores/useDrawingStore';
import { clampAxis } from './clamp-axis';
import type { SymmetryFields } from './editor.type';

const symmetryOf = (settings: SymmetryFields, size: Size): Symmetry => {
  const { symmetryDiagonal, symmetryTurn } = useDrawingStore.getState();
  const crossing = symmetryDiagonal || symmetryTurn;
  if (!crossing) {
    return {
      ...(settings.symmetryX ? { x2: clampAxis(settings.axisX, size.width) } : {}),
      ...(settings.symmetryY ? { y2: clampAxis(settings.axisY, size.height) } : {}),
    };
  }
  const x2 = clampAxis(settings.axisX, size.width);
  const raw = clampAxis(settings.axisY, size.height);
  const y2 = crossing && (raw - x2) % 2 !== 0 ? raw - 1 : raw;
  return {
    x2,
    y2,
    ...(settings.symmetryX ? {} : { mirrorX: false }),
    ...(settings.symmetryY ? {} : { mirrorY: false }),
    ...(symmetryDiagonal ? { diagonal: true } : {}),
    ...(symmetryTurn ? { turn4: true } : {}),
  };
};

export { symmetryOf };
