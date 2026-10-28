/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuData } from '../../../context-menu/menu-data';
import { unless } from '../../../context-menu/unless';
import { hasGuides } from '../../../guides/has-guides';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { handlePosition } from '../../../ruler/handle-position';
import { nearHandle } from '../../../ruler/near-handle';
import { currentCanvasSurface } from '../../../canvas-surface/current-canvas-surface';
import { useRulerStore } from '../../../stores/useRulerStore';
import { RULER_MENU } from '../CanvasRuler.constants';
import type { RulerArgs } from '../CanvasRuler.type';
import { rulerAlong } from './ruler-along';
import { unitEntries } from './unit-entries';
import { rulerAxisState } from './ruler-axis-state';
import { rulerSpan } from './ruler-span';

const rulerMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const { axis } = menuData<RulerArgs>(context);
  if (axis === undefined) return [];
  const span = rulerSpan(axis, useRulerStore.getState());
  const along = rulerAlong(axis, context, span.length / 2);
  const { handle, centred } = rulerAxisState(axis, span);
  const onHandle = handle !== null && nearHandle(along, handlePosition(handle, span));
  const surface = currentCanvasSurface();
  const mirrors = surface === 'sprite' || surface === 'tile';
  return [
    { command: 'symmetry.axis_remove', label: RULER_MENU.remove, args: { axis }, hidden: !onHandle },
    { command: 'guide.add_here', label: RULER_MENU.guide, args: { axis, position: (along - span.origin) / Math.max(span.zoom, 0.01) } },
    { command: 'symmetry.axis_here', label: RULER_MENU.here, args: { axis, position: (along - span.origin) / Math.max(span.zoom, 0.01) }, hidden: !mirrors },
    { command: axis === 'x' ? COMMAND_ID.symmetryX : COMMAND_ID.symmetryY, label: RULER_MENU.mirror, hidden: !mirrors },
    { command: 'symmetry.axis_centre', label: RULER_MENU.centre, args: { axis }, hidden: !mirrors, ...unless(!centred, RULER_MENU.centred) },
    'separator',
    unitEntries(),
    COMMAND_ID.rulers,
    'separator',
    { command: 'guide.clear', label: RULER_MENU.clearGuides, tone: 'danger', ...unless(hasGuides(), RULER_MENU.noGuides) },
  ];
};

export { rulerMenuEntries };
