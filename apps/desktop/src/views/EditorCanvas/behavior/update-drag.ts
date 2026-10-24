/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { currentTarget } from '../../../editor/current-target';
import { setFloatOffset } from '../../../editor/pending/set-float-offset';
import { incomingMask } from '../../../editor/selection/incoming-mask';
import { mergeMask } from '../../../editor/selection/merge-mask';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { ActiveDrag } from './canvas-tools.type';
import { pixelAtEvent } from './pixel-at-event';
import { rawPixelAt } from './raw-pixel-at';

const updateDrag = (active: ActiveDrag, viewport: PixelViewportHandle | null, event: PointerEvent<HTMLElement>): void => {
  if (active.kind === 'float') {
    const at = rawPixelAt(viewport, event);
    setFloatOffset({ x: active.origin.x + at.x - active.start.x, y: active.origin.y + at.y - active.start.y });
    return;
  }
  const target = currentTarget();
  if (!target) return;
  const at = pixelAtEvent(viewport, event);
  const { shape } = active;
  active.shape = { ...shape, to: at, path: shape.variant === 'lasso' ? [...shape.path, at] : shape.path };
  useSelectionStore.getState().setDraft(mergeMask(active.base, incomingMask(active.shape, target.sprite), active.mode));
};

export { updateDrag };
