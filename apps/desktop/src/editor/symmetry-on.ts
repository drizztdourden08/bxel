/* @layer renderer-app @kind logic */
import { useToolStore } from '../stores/useToolStore';

const symmetryOn = (axis: 'x' | 'y'): boolean => {
  const tools = useToolStore.getState();
  return axis === 'x' ? tools.symmetryX : tools.symmetryY;
};

export { symmetryOn };
