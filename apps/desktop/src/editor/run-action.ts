/* @layer renderer-app @kind logic */
import { useToolStore } from '../stores/useToolStore';
import type { EditorAction } from './editor.type';
import { runLayerOp } from './run-layer-op';
import { stepHistory } from './step-history';

const runAction = (action: EditorAction): void => {
  const tools = useToolStore.getState();
  if (action.kind === 'tool') tools.setTool(action.tool);
  else if (action.kind === 'swap') tools.swapColors();
  else if (action.kind === 'layer') runLayerOp(action.op);
  else stepHistory(action.kind);
};

export { runAction };
