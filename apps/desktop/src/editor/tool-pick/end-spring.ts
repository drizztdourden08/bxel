/* @layer renderer-app @kind logic */
import type { HoldContext } from '@drizztdourden08/brock-react';
import { useToolStore } from '../../stores/useToolStore';
import { springFrom } from './spring-from';

const endSpring = (context: HoldContext): void => {
  const back = springFrom.tool;
  springFrom.tool = null;
  const leaving = context.cause === 'keyup' || context.cause === 'blur';
  if (back && leaving && !context.tap) useToolStore.getState().setTool(back);
};

export { endSpring };
