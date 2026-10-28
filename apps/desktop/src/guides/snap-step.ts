/* @layer renderer-app @kind logic */
import { useSnapGridStore } from '../stores/useSnapGridStore';
import { useViewStore } from '../stores/useViewStore';
import type { GuideAxis } from './guide.type';

const snapStep = (axis: GuideAxis): number | null => {
  const { grid } = useSnapGridStore.getState();
  if (!useViewStore.getState().snap || !grid) return null;
  return axis === 'x' ? grid.width : grid.height;
};

export { snapStep };
