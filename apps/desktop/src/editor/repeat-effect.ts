/* @layer renderer-app @kind logic */
import { useDrawingStore } from '../stores/useDrawingStore';
import type { ToolId } from './tool.type';

const repeatEffect = (tool: ToolId): void => {
  if (tool !== 'rect' && tool !== 'ellipse') return;
  const drawing = useDrawingStore.getState();
  drawing.setFilled(tool, !drawing.filled[tool]);
};

export { repeatEffect };
