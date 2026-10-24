/* @layer renderer-app @kind hook */
import { useRef, useState } from 'react';
import type { RefObject } from 'react';
import { allowPress } from '../../../editor/allow-press';
import { commitSession } from '../../../editor/commit-session';
import { currentTarget } from '../../../editor/current-target';
import type { PaintSession } from '../../../editor/editor.type';
import { extendStroke } from '../../../editor/extend-stroke';
import { insideSprite } from '../../../editor/inside-sprite';
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
      if (!insideSprite(target, at) || !allowPress(plan, target)) return;
      if (plan.kind === 'pick' || plan.kind === 'fill') {
        runInstant(plan.kind, target, at, plan.slot);
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      const started = startSession(plan, target, at);
      session.current = started;
      setLive(new ImageData(started.rgba, started.width, started.height));
    },
    move: (event) => {
      const active = session.current;
      if (!active) return;
      const at = pixelAtEvent(viewport.current, event);
      if (active.kind === 'stroke') extendStroke(active, at);
      else updateShape(active, at, event.shiftKey);
      viewport.current?.redraw();
    },
    up: () => {
      const done = session.current;
      session.current = null;
      setLive(null);
      if (done) commitSession(done);
    },
  };
};

export { usePaintGesture };
