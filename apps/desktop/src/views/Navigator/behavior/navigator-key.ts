/* @layer renderer-app @kind logic */
import { useViewStore } from '../../../stores/useViewStore';

const navigatorKey = (key: string): boolean => {
  const { viewport } = useViewStore.getState();
  if (!viewport) return false;
  const moves: Record<string, () => void> = {
    '+': () => viewport.zoomIn(),
    '=': () => viewport.zoomIn(),
    '-': () => viewport.zoomOut(),
    Home: () => viewport.fit(),
  };
  const move = moves[key];
  move?.();
  return move !== undefined;
};

export { navigatorKey };
