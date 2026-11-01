/* @layer renderer-app @kind logic */
import type { HoldContext } from '@drizztdourden08/brock-react';
import { useToolPrefsStore } from '../../stores/useToolPrefsStore';
import { useToolStore } from '../../stores/useToolStore';
import { useSpringStore } from './behavior/useSpringStore';

const endSpring = (context: HoldContext): void => {
  const back = useSpringStore.getState().tool;
  useSpringStore.getState().borrow(null, null);
  const leaving = context.cause === 'keyup' || context.cause === 'blur';
  const tap = context.heldMs < useToolPrefsStore.getState().springMs;
  if (back && leaving && !tap) useToolStore.getState().setTool(back);
};

export { endSpring };
