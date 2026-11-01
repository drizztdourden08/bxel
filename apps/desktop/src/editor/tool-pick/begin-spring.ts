/* @layer renderer-app @kind logic */
import { useToolStore } from '../../stores/useToolStore';
import type { ToolId } from '../tool.type';
import { useSpringStore } from './behavior/useSpringStore';

const beginSpring = (tool: ToolId): void => {
  const current = useToolStore.getState().tool;
  if (current === tool) return;
  useSpringStore.getState().borrow(current, tool);
};

export { beginSpring };
