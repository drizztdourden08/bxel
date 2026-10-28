/* @layer renderer-app @kind logic */
import { useViewFeedStore } from '../../../stores/useViewFeedStore';
import { useViewStore } from '../../../stores/useViewStore';
import { NAVIGATOR_KEY_SHARE } from '../Navigator.constants';
import { visibleRect } from './visible-rect';

const navigatorKey = (key: string, whole: boolean): boolean => {
  const { view } = useViewFeedStore.getState();
  const { viewport } = useViewStore.getState();
  if (!view || !viewport) return false;
  const rect = visibleRect(view);
  const step = whole ? 1 : NAVIGATOR_KEY_SHARE;
  const moves: Record<string, () => void> = {
    ArrowLeft: () => viewport.panTo({ x: view.pan.x - rect.width * step, y: view.pan.y }),
    ArrowRight: () => viewport.panTo({ x: view.pan.x + rect.width * step, y: view.pan.y }),
    ArrowUp: () => viewport.panTo({ x: view.pan.x, y: view.pan.y - rect.height * step }),
    ArrowDown: () => viewport.panTo({ x: view.pan.x, y: view.pan.y + rect.height * step }),
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
