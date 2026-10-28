/* @layer renderer-app @kind hook */
import { useRef, useState } from 'react';
import type { RefObject } from 'react';
import { allowPress } from '../../../editor/allow-press';
import { commitSession } from '../../../editor/commit-session';
import { currentTarget } from '../../../editor/current-target';
import type { PaintSession } from '../../../editor/editor.type';
import { extendStroke } from '../../../editor/extend-stroke';
import { foldToSprite } from '../../../editor/fold-to-sprite';
import { handOffImage } from '../../../editor/hand-off-image';
import { insidePaintArea } from '../../../editor/inside-paint-area';
import { endLivePaint, startLivePaint, updateLivePaint } from '../../../editor/live-paint';
import { pressPlan } from '../../../editor/press-plan';
import { runInstant } from '../../../editor/run-instant';
import { startSession } from '../../../editor/start-session';
import { updateShape } from '../../../editor/update-shape';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { PaintGesture } from './canvas-tools.type';
import { pixelAtEvent } from './pixel-at-event';
import { zoomAtPointer } from './zoom-at-pointer';

const usePaintGesture = (viewport: RefObject<PixelViewportHandle | null>): PaintGesture => {
  const session = useRef<PaintSession | null>(null);
  const image = useRef<ImageData | null>(null);
  const [live, setLive] = useState<ImageData | null>(null);
  return {
    live,
    down: (event) => {
      const target = currentTarget();
      const plan = pressPlan(useToolStore.getState().tool, event);
      if (!target || !plan) return;
      if (plan.kind === 'zoom') {
        zoomAtPointer(viewport.current, event, plan.out);
        return;
      }
      const at = pixelAtEvent(viewport.current, event);
      if (!insidePaintArea(target, at) || !allowPress(plan, target)) return;
      if (plan.kind === 'pick' || plan.kind === 'fill') {
        runInstant(plan.kind, target, foldToSprite(target, at), plan.slot);
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      const started = startSession(plan, target, at);
      session.current = started;
      startLivePaint(started);
      image.current = new ImageData(started.rgba, started.width, started.height);
      setLive(image.current);
    },
    move: (event) => {
      const active = session.current;
      if (!active) return;
      const at = pixelAtEvent(viewport.current, event);
      if (active.kind === 'stroke') extendStroke(active, at);
      else updateShape(active, at, event.shiftKey);
      viewport.current?.redraw();
      updateLivePaint();
    },
    up: () => {
      const done = session.current;
      const shown = image.current;
      session.current = null;
      image.current = null;
      endLivePaint();
      setLive(null);
      if (!done) return;
      const result = commitSession(done);
      if (shown) handOffImage(done, shown, result);
    },
  };
};

export { usePaintGesture };
