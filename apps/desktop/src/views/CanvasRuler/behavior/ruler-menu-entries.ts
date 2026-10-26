/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { clampAxis } from '../../../editor/clamp-axis';
import { menuData } from '../../../context-menu/menu-data';
import { unless } from '../../../context-menu/unless';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { handlePosition } from '../../../ruler/handle-position';
import { nearHandle } from '../../../ruler/near-handle';
import { useRulerStore } from '../../../stores/useRulerStore';
import { useToolStore } from '../../../stores/useToolStore';
import { RULER_MENU } from '../CanvasRuler.constants';
import type { RulerArgs } from '../CanvasRuler.type';
import { rulerSpan } from './ruler-span';

const rulerMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const { axis } = menuData<RulerArgs>(context);
  if (axis === undefined) return [];
  const tools = useToolStore.getState();
  const span = rulerSpan(axis, useRulerStore.getState());
  const rect = context.target instanceof Element ? context.target.closest('[data-context-menu]')?.getBoundingClientRect() : undefined;
  const along = rect ? (axis === 'x' ? context.point.x - rect.left : context.point.y - rect.top) : span.length / 2;
  const on = axis === 'x' ? tools.symmetryX : tools.symmetryY;
  const placed = axis === 'x' ? tools.axisX : tools.axisY;
  const handle = on ? clampAxis(placed, span.count) : null;
  const centred = clampAxis(placed, span.count) === span.count;
  return [
    { command: 'symmetry.axis_remove', label: RULER_MENU.remove, args: { axis }, hidden: handle === null || !nearHandle(along, handlePosition(handle, span)) },
    { command: 'symmetry.axis_here', label: RULER_MENU.here, args: { axis, position: (along - span.origin) / Math.max(span.zoom, 0.01) } },
    { command: axis === 'x' ? COMMAND_ID.symmetryX : COMMAND_ID.symmetryY, label: RULER_MENU.mirror },
    { command: 'symmetry.axis_centre', label: RULER_MENU.centre, args: { axis }, ...unless(!centred, RULER_MENU.centred) },
    'separator',
    COMMAND_ID.rulers,
  ];
};

export { rulerMenuEntries };
