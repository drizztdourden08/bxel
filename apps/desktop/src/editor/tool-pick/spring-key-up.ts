/* @layer renderer-app @kind logic */
import { useSpringStore } from './behavior/useSpringStore';
import { springKeyHeld } from './spring-key-held';

const springKeyUp = (key: string | null = null): void => {
  if (springKeyHeld.key === null || (key !== null && key !== springKeyHeld.key)) return;
  springKeyHeld.key = null;
  useSpringStore.getState().borrow(null, null);
};

export { springKeyUp };
