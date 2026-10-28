/* @layer renderer-app @kind logic */
import { toolbars, widgets } from '@drizztdourden08/brock-react';

const layoutSnapshot = () => ({
  widgets: widgets.list().map((each) => ({
    id: each.id,
    label: each.label,
    visible: each.visible,
    placement: each.placement,
    side: each.side,
    size: each.size,
    index: each.index,
    tab: each.tab,
    rect: each.rect,
    popped: each.popped,
    available: each.available,
  })),
  toolbars: toolbars.list().map((each) => ({ id: each.id, label: each.label, shown: each.shown, side: each.side, row: each.row, index: each.index, labels: each.labels })),
});

export { layoutSnapshot };
