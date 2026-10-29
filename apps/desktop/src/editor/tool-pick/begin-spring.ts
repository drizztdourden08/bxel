/* @layer renderer-app @kind logic */
import { useToolStore } from '../../stores/useToolStore';
import type { ToolId } from '../tool.type';
import { springFrom } from './spring-from';

const beginSpring = (tool: ToolId): void => {
  const current = useToolStore.getState().tool;
  springFrom.tool = current === tool ? springFrom.tool : current;
};

export { beginSpring };
