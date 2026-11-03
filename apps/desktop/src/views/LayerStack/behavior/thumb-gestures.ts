/* @layer renderer-app @kind logic */
import type { MouseEvent } from 'react';
import { modeOf } from '../../../editor/selection/mode-of';
import { selectLayerPixels } from '../../../editor/selection/select-layer-pixels';
import { STRIP_ROOT, STRIP_TARGET } from '../LayerStack.constants';
import type { ThumbClick } from './thumb-gestures.type';

const focusStrip = (from: HTMLElement): void => {
  from.closest<HTMLElement>(STRIP_ROOT)?.querySelector<HTMLElement>(STRIP_TARGET)?.focus();
};

const thumbGestures = (layerId: string, pixels: boolean) => ({
  onClick: (event: ThumbClick): void => {
    if (!pixels || !(event.ctrlKey || event.metaKey)) return;
    event.stopPropagation();
    selectLayerPixels(layerId, modeOf(event, 'replace'));
  },
  onDoubleClick: (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    focusStrip(event.currentTarget);
  },
});

export { thumbGestures };
