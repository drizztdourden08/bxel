/* @layer renderer-app @kind logic */
import type { HoldContext } from '@drizztdourden08/brock-react';
import { useToolPrefsStore } from '../../stores/useToolPrefsStore';
import { useToolStore } from '../../stores/useToolStore';
import { useSpringStore } from './behavior/useSpringStore';
import { returnWhenIdle } from './return-when-idle';
import { strokeActive } from './stroke-active';

const endSpring = (context: HoldContext): void => {
  const back = useSpringStore.getState().tool;
  const leaving = context.cause === 'keyup' || context.cause === 'blur';
  const tap = context.heldMs < useToolPrefsStore.getState().springMs;
  const returning = back !== null && leaving && !tap;
  if (returning && strokeActive()) {
    returnWhenIdle(back);
    return;
  }
  useSpringStore.getState().borrow(null, null);
  if (returning) useToolStore.getState().setTool(back);
};

export { endSpring };
