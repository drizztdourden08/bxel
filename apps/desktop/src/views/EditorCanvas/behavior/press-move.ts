/* @layer renderer-app @kind logic */
import type { PointerEvent } from 'react';
import { pathDraft } from '../../../editor/path-draft';
import { useLivePaintStore } from '../../../stores/useLivePaintStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import { gestureLive } from './gesture-live';
import { moveSession } from './move-session';
import { pixelAtEvent } from './pixel-at-event';

const pressMove = (viewport: PixelViewportHandle | null, event: PointerEvent<HTMLElement>): void => {
  const active = gestureLive.session ?? pathDraft.current;
  if (!active) return;
  const at = pixelAtEvent(viewport, event);
  if (gestureLive.session || event.buttons === 0) moveSession(active, at, event);
  viewport?.redraw();
  useLivePaintStore.getState().update();
};

export { pressMove };
