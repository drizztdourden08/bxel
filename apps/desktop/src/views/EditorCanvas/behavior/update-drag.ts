/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { currentTarget } from '../../../editor/current-target';
import { setFloatOffset } from '../../../editor/pending/set-float-offset';
import { shiftMask } from '../../../editor/pending/shift-mask';
import { dragHint } from '../../../editor/selection/drag-hint';
import { incomingMask } from '../../../editor/selection/incoming-mask';
import { mergeMask } from '../../../editor/selection/merge-mask';
import { nextShape } from '../../../editor/selection/next-shape';
import { heldKeys } from '../../../editor/selection/held-keys';
import { shapeHold } from '../../../editor/selection/shape-hold';
import { lockAxis } from '../../../editor/transform/lock-axis';
import { useGestureStore } from '../../../stores/useGestureStore';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ActiveDrag } from './canvas-tools.type';
import { pixelAtEvent } from './pixel-at-event';
import { rawPixelAt } from './raw-pixel-at';
import { snapFloat } from './snap-float';
import { snapMarquee } from './snap-marquee';

const updateDrag = (active: ActiveDrag, viewport: PixelViewportHandle | null, event: PointerEvent<HTMLElement>): void => {
  if (active.kind === 'float') {
    const at = rawPixelAt(viewport, event);
    const delta = lockAxis({ x: at.x - active.start.x, y: at.y - active.start.y }, event.shiftKey);
    setFloatOffset(snapFloat(viewport, { x: active.origin.x + delta.x, y: active.origin.y + delta.y }));
    return;
  }
  if (active.kind === 'outline') {
    const at = rawPixelAt(viewport, event);
    useSelectionStore.getState().setDraft(shiftMask(active.base, { x: at.x - active.start.x, y: at.y - active.start.y }));
    return;
  }
  const target = currentTarget();
  if (!target) return;
  const { shape } = active;
  const at = snapMarquee(viewport, event, { at: pixelAtEvent(viewport, event), from: shape.from, variant: shape.variant });
  active.hold = shapeHold(active.keys, heldKeys(event));
  active.shape = nextShape(shape, at, active.hold);
  useSelectionStore.getState().setDraft(mergeMask(active.base, incomingMask(active.shape, target.sprite, active.hold), active.mode));
  useGestureStore.getState().setHint(dragHint(active.shape, active.mode, active.hold));
};

export { updateDrag };
