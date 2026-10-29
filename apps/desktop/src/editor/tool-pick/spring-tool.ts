/* @layer renderer-app @kind logic */
import type { HoldContext } from '@drizztdourden08/brock-react';
import { useToolStore } from '../../stores/useToolStore';
import type { ToolId } from '../tool.type';

const SPRING_TOOLS: readonly ToolId[] = ['hand', 'zoom'];

const springFrom: { tool: ToolId | null } = { tool: null };

const isSpringTool = (tool: ToolId): boolean => SPRING_TOOLS.includes(tool);

const beginSpring = (tool: ToolId): void => {
  const current = useToolStore.getState().tool;
  springFrom.tool = current === tool ? springFrom.tool : current;
};

const endSpring = (context: HoldContext): void => {
  const back = springFrom.tool;
  springFrom.tool = null;
  const leaving = context.cause === 'keyup' || context.cause === 'blur';
  if (back && leaving && !context.tap) useToolStore.getState().setTool(back);
};

export { beginSpring, endSpring, isSpringTool };
