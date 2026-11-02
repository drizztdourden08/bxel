/* @layer renderer-app @kind logic */
import type { MouseEvent } from 'react';
import { selectLayerPixels } from '../../../editor/selection/select-layer-pixels';
import { STRIP_ROOT, STRIP_TARGET } from '../LayerStack.constants';

const focusStrip = (from: HTMLElement): void => {
  from.closest<HTMLElement>(STRIP_ROOT)?.querySelector<HTMLElement>(STRIP_TARGET)?.focus();
};

const thumbGestures = (layerId: string, pixels: boolean) => ({
  onClick: (event: MouseEvent<HTMLElement>): void => {
    if (!pixels || !(event.ctrlKey || event.metaKey)) return;
    event.stopPropagation();
    selectLayerPixels(layerId, event.shiftKey ? 'add' : 'replace');
  },
  onDoubleClick: (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    focusStrip(event.currentTarget);
  },
});

export { thumbGestures };
