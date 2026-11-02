/* @layer renderer-app @kind hook */
import { openContextMenu } from '@drizztdourden08/brock-react';
import type { MouseEvent } from 'react';
import { slotsOf } from '../../../editor/tool-catalogue/slots-of';
import { currentSurface } from '../../../editor/tool-catalogue/current-surface';
import { TOOL_RAIL_TEXT } from '../ToolRail.constants';
import { railDoubleClick } from './rail-double-click';
import { flyoutModel } from '../../../tool-menu/flyout-model';
import { flyoutRows } from '../../../tool-menu/flyout-rows';
import { menuPoint } from '../../../tool-menu/menu-point';
import { stopOf } from '../../../tool-menu/stop-of';

const hasFlyout = (id: string | null): boolean => {
  const surface = currentSurface();
  const slot = slotsOf(surface).find((each) => each.id === id);
  return slot !== undefined && flyoutModel(slot, surface).hasContent;
};

const useRailHold = () => {
  const onContextMenu = (event: MouseEvent<HTMLElement>): void => {
    const stop = stopOf(event.target);
    const id = stop?.getAttribute('data-toolbar-stop') ?? null;
    if (stop === null || !hasFlyout(id)) return;
    event.preventDefault();
    openContextMenu(TOOL_RAIL_TEXT.zone, id, { point: menuPoint(stop, flyoutRows(id)), trigger: 'pointer' });
  };
  const onDoubleClick = (event: MouseEvent<HTMLElement>): void => {
    const stop = stopOf(event.target);
    if (stop !== null && railDoubleClick(stop.getAttribute('data-toolbar-stop'))) event.preventDefault();
  };
  return { onContextMenu, onDoubleClick };
};

export { useRailHold };
