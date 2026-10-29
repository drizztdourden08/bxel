/* @layer renderer-app @kind logic */
import type { SpriteSymmetry } from '@bxel/document';

const symmetryKey = (symmetry: SpriteSymmetry): string =>
  [symmetry.x, symmetry.y, symmetry.axisX, symmetry.axisY, symmetry.diagonal, symmetry.turn].join('|');

export { symmetryKey };
