/* @layer renderer-app @kind logic */
import { zoomView } from '../../../editor/zoom-view';
import { RAIL_DOUBLE_CLICK } from './rail-double-click.constants';

const railDoubleClick = (stopId: string | null): boolean => {
  const step = stopId === null ? undefined : RAIL_DOUBLE_CLICK[stopId];
  if (step === undefined) return false;
  zoomView(step);
  return true;
};

export { railDoubleClick };
