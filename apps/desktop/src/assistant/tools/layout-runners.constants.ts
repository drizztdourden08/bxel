/* @layer renderer-app @kind constants */
import { toolbars, widgets } from '@drizztdourden08/brock-react';
import type { Runners } from './layout-op.type';

const LAYOUT_RUNNERS: Runners = {
  show: (op) => widgets.open(op.widget),
  hide: (op) => widgets.close(op.widget),
  toggle: (op) => widgets.toggle(op.widget),
  popOut: (op) => widgets.popOut(op.widget),
  focus: (op) => widgets.focus(op.widget),
  dock: (op) => widgets.dock(op.widget, { side: op.side, ...(op.size === undefined ? {} : { size: op.size }), ...(op.index === undefined ? {} : { index: op.index }) }),
  float: (op) => widgets.float(op.widget, op.rect),
  resize: (op) => {
    const to = op.rect ?? op.size;
    if (to === undefined) throw new Error('resize needs a size or a rect.');
    return widgets.resize(op.widget, to);
  },
  applyPreset: (op) => widgets.applyPreset(op.name),
  resetWidgets: () => widgets.reset(),
  showToolbar: (op) => toolbars.show(op.toolbar),
  hideToolbar: (op) => toolbars.hide(op.toolbar),
  toolbarSide: (op) => toolbars.moveToSide(op.toolbar, op.side, op.row),
  toolbarLabels: (op) => toolbars.labels(op.toolbar, op.on),
  resetToolbars: () => toolbars.reset(),
};

export { LAYOUT_RUNNERS };
