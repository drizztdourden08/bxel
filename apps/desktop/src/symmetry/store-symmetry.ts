/* @layer renderer-app @kind logic */
import type { SpriteSymmetry } from '@bxel/document';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';

const storeSymmetry = (): SpriteSymmetry => {
  const tool = useToolStore.getState();
  const drawing = useDrawingStore.getState();
  return { x: tool.symmetryX, y: tool.symmetryY, axisX: tool.axisX, axisY: tool.axisY, diagonal: drawing.symmetryDiagonal, turn: drawing.symmetryTurn };
};

export { storeSymmetry };
