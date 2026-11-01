/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { useToolStore } from '../stores/useToolStore';
import { BRUSH_SIZE_ANNOUNCE } from './brush-resize.constants';

const stepBrushSizeBy = (delta: number): void => {
  const tools = useToolStore.getState();
  tools.stepBrushSize(delta);
  announce(BRUSH_SIZE_ANNOUNCE(useToolStore.getState().brushSize));
};

export { stepBrushSizeBy };
