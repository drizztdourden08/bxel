/* @layer renderer-app @kind logic */
import type { ContextMenuContext, ContextMenuEntry } from '@drizztdourden08/brock-react';
import { menuData } from '../../../context-menu/menu-data';
import { unless } from '../../../context-menu/unless';
import { hasGuides } from '../../../guides/has-guides';
import { COMMAND_ID } from '../../../keymap/keymap.constants';
import { handlePosition } from '../../../ruler/handle-position';
import { nearHandle } from '../../../ruler/near-handle';
import { currentCanvasSurface } from '../../../canvas-surface/current-canvas-surface';
import { spanAlong } from '../../../ruler/span-along';
import { spanReversed } from '../../../ruler/span-reversed';
import { useRulerStore } from '../../../stores/useRulerStore';
import { useViewStore } from '../../../stores/useViewStore';
import { RULER_MENU } from '../CanvasRuler.constants';
import type { RulerArgs } from '../CanvasRuler.type';
import { rulerAlong } from './ruler-along';
import { guideColourEntries } from './guide-colour-entries';
import { nearGuide } from './near-guide';
import { unitEntries } from './unit-entries';
import { rulerAxisState } from './ruler-axis-state';
import { rulerSpan } from './ruler-span';

const rulerMenuEntries = (context: ContextMenuContext): readonly ContextMenuEntry[] => {
  const { axis } = menuData<RulerArgs>(context);
  if (axis === undefined) return [];
  const surface = currentCanvasSurface();
  const base = rulerSpan(axis, useRulerStore.getState());
  const span = { ...base, reversed: spanReversed(axis, useViewStore.getState().mirror, surface) };
  const along = spanAlong(rulerAlong(axis, context, span.length / 2), span);
  const { handle, centred } = rulerAxisState(axis, span);
  const onHandle = handle !== null && nearHandle(along, handlePosition(handle, span));
  const position = (along - span.origin) / Math.max(span.zoom, 0.01);
  const mirrors = surface === 'sprite' || surface === 'tile';
  return [
    { command: 'symmetry.axis_remove', label: RULER_MENU.remove, args: { axis }, hidden: !onHandle },
    { command: 'guide.add_here', label: RULER_MENU.guide, args: { axis, position } },
    { command: 'symmetry.axis_here', label: RULER_MENU.here, args: { axis, position }, hidden: !mirrors },
    { command: axis === 'x' ? COMMAND_ID.symmetryX : COMMAND_ID.symmetryY, label: RULER_MENU.mirror, hidden: !mirrors },
    { command: 'symmetry.axis_centre', label: RULER_MENU.centre, args: { axis }, hidden: !mirrors, ...unless(!centred, RULER_MENU.centred) },
    'separator',
    unitEntries(),
    COMMAND_ID.rulers,
    COMMAND_ID.lockGuides,
    guideColourEntries(axis, nearGuide({ axis, position, zoom: span.zoom })),
    'separator',
    { command: 'guide.clear', label: RULER_MENU.clearGuides, tone: 'danger', ...unless(hasGuides(), RULER_MENU.noGuides) },
  ];
};

export { rulerMenuEntries };
