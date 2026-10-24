/* @layer renderer-app @kind logic */
import type { Size, Symmetry } from '@bxel/raster';
import { clampAxis } from './clamp-axis';
import type { SymmetryFields } from './editor.type';

const symmetryOf = (settings: SymmetryFields, size: Size): Symmetry => ({
  ...(settings.symmetryX ? { x2: clampAxis(settings.axisX, size.width) } : {}),
  ...(settings.symmetryY ? { y2: clampAxis(settings.axisY, size.height) } : {}),
});

export { symmetryOf };
