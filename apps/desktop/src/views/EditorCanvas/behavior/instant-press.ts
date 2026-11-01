/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { allowPress } from '../../../editor/allow-press';
import { foldToSprite } from '../../../editor/fold-to-sprite';
import { insidePaintArea } from '../../../editor/inside-paint-area';
import { runInstant } from '../../../editor/run-instant';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { Instant } from './instant-press.type';
import { zoomAtPointer } from './zoom-at-pointer';

const instantPress = (viewport: PixelViewportHandle | null, event: PointerEvent<HTMLElement>, instant: Instant): void => {
  const { plan, target, at } = instant;
  if (plan.kind === 'zoom') {
    zoomAtPointer(viewport, event, plan.out);
    return;
  }
  if (!insidePaintArea(target, at) || !allowPress(plan, target)) return;
  if (plan.kind === 'pick' || plan.kind === 'fill') runInstant(plan.kind, target, foldToSprite(target, at), plan.slot, plan.kind === 'pick' && plan.ramp === true);
};

export { instantPress };
