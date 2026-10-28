/* @layer renderer-app @kind logic */
import { flyoutRows } from '../../../tool-menu/flyout-rows';
import { menuPoint } from '../../../tool-menu/menu-point';
import { stopOf } from '../../../tool-menu/stop-of';
import type { RailAnchor } from './rail-anchor.type';

const railAnchor = ({ target, data }: { target: Element; data: unknown }): RailAnchor | null => {
  const stop = stopOf(target);
  if (stop === null) return null;
  const id = typeof data === 'string' ? data : stop.getAttribute('data-toolbar-stop');
  return { ...menuPoint(stop, flyoutRows(id)), data: id };
};

export { railAnchor };
