/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { pathDraft } from '../../../editor/path-draft';
import { useLivePaintStore } from '../../../stores/useLivePaintStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { gestureLive } from './gesture-live';
import { moveSession } from './move-session';
import { pixelAtEvent } from './pixel-at-event';
import { pointerSamples } from './pointer-samples';
import { stabilisedAt } from './stabilised-at';

const pressMove = (viewport: PixelViewportHandle | null, event: PointerEvent<HTMLElement>): void => {
  const active = gestureLive.session ?? pathDraft.current;
  if (!active) return;
  if (gestureLive.session || event.buttons === 0) {
    if (active.kind === 'stroke') {
      for (const sample of pointerSamples(event)) moveSession(active, stabilisedAt(viewport, sample), event);
    } else {
      moveSession(active, pixelAtEvent(viewport, event), event);
    }
  }
  viewport?.redraw();
  useLivePaintStore.getState().update();
};

export { pressMove };
