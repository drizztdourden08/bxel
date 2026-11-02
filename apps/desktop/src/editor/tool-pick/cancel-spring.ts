/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { useToolStore } from '../../stores/useToolStore';
import { useSpringStore } from './behavior/useSpringStore';
import { springKeyHeld } from './spring-key-held';
import { springPending } from './spring-pending';
import { SPRING_END_NOTICE } from './spring-keys.constants';

const cancelSpring = (): void => {
  const { tool: home, borrowed } = useSpringStore.getState();
  springPending.stop?.();
  springPending.stop = null;
  if (borrowed === null) return;
  const byKey = springKeyHeld.key !== null;
  springKeyHeld.key = null;
  useSpringStore.getState().borrow(null, null);
  if (!byKey && home !== null) useToolStore.getState().setTool(home);
  announce(SPRING_END_NOTICE);
};

export { cancelSpring };
