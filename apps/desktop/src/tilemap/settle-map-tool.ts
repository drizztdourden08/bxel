/* @layer renderer-app @kind logic */
import { useToolStore } from '../stores/useToolStore';
import { currentSurface } from '../surface/current-surface';

const settleMapTool = (): void => useToolStore.getState().enterSurface(currentSurface());

export { settleMapTool };
