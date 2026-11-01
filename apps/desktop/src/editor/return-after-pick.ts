/* @layer renderer-app @kind logic */
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';

const returnAfterPick = (): void => {
  const { tool, previousTool, setTool } = useToolStore.getState();
  if (tool === 'picker' && previousTool !== null && useDrawingStore.getState().pickReturn) setTool(previousTool);
};

export { returnAfterPick };
