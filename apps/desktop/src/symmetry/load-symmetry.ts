/* @layer renderer-app @kind logic */
import type { SpriteSymmetry } from '@bxel/document';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';

const loadSymmetry = (symmetry: SpriteSymmetry): void => {
  useToolStore.setState({ symmetryX: symmetry.x, symmetryY: symmetry.y, axisX: symmetry.axisX, axisY: symmetry.axisY });
  useDrawingStore.getState().patch({ symmetryDiagonal: symmetry.diagonal, symmetryTurn: symmetry.turn });
};

export { loadSymmetry };
