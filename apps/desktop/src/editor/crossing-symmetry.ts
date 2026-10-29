/* @layer renderer-app @kind logic */
import type { Size, Symmetry } from '@bxel/raster';
import { clampAxis } from './clamp-axis';
import type { CrossingModes } from './crossing-symmetry.type';
import type { SymmetryFields } from './editor.type';

const crossingSymmetry = (settings: SymmetryFields, size: Size, modes: CrossingModes): Symmetry => {
  const x2 = clampAxis(settings.axisX, size.width);
  const raw = clampAxis(settings.axisY, size.height);
  return {
    x2,
    y2: (raw - x2) % 2 !== 0 ? raw - 1 : raw,
    ...(settings.symmetryX ? {} : { mirrorX: false }),
    ...(settings.symmetryY ? {} : { mirrorY: false }),
    ...(modes.diagonal ? { diagonal: true } : {}),
    ...(modes.turn ? { turn4: true } : {}),
  };
};

export { crossingSymmetry };
