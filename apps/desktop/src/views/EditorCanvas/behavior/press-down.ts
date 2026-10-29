/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { allowPress } from '../../../editor/allow-press';
import { currentTarget } from '../../../editor/current-target';
import { insidePaintArea } from '../../../editor/inside-paint-area';
import { pressPlan } from '../../../editor/press-plan';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { beginGesture } from './begin-gesture';
import { instantPress } from './instant-press';
import { isDrawPlan } from './is-draw-plan';
import { pixelAtEvent } from './pixel-at-event';
import { pressDraft } from './press-draft';

const pressDown = (viewport: PixelViewportHandle | null, event: PointerEvent<HTMLElement>): void => {
  const target = currentTarget();
  const plan = pressPlan(useToolStore.getState().tool, event);
  if (!target || !plan) return;
  const at = pixelAtEvent(viewport, event);
  if (!isDrawPlan(plan)) {
    instantPress(viewport, event, { plan, target, at });
    return;
  }
  if (!insidePaintArea(target, at) || !allowPress(plan, target) || pressDraft(plan, at, event)) return;
  event.currentTarget.setPointerCapture(event.pointerId);
  beginGesture(plan, target, at);
};

export { pressDown };
