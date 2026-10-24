/* @layer renderer-app @kind logic */
import { useToolStore } from '../stores/useToolStore';

const settleMapTool = (): void => {
  const tools = useToolStore.getState();
  if (tools.tool === 'move') tools.selectTool('pencil');
};

export { settleMapTool };
