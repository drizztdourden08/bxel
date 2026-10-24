/* @layer renderer-app @kind hook */
import { useRef, useState } from 'react';
import type { PointerEvent, RefObject } from 'react';
import type { Point } from '@bxel/raster';
import { allowPress } from '../../../editor/allow-press';
import { clampPoint } from '../../../editor/clamp-point';
import { commitStroke } from '../../../editor/commit-stroke';
import { currentTarget } from '../../../editor/current-target';
import type { StrokeSession } from '../../../editor/editor.type';
import { extendStroke } from '../../../editor/extend-stroke';
import { insideSprite } from '../../../editor/inside-sprite';
import { pressPlan } from '../../../editor/press-plan';
import { runInstant } from '../../../editor/run-instant';
import { startStroke } from '../../../editor/start-stroke';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { CanvasTools } from './canvas-tools.type';

const useCanvasTools = (viewport: RefObject<PixelViewportHandle | null>): CanvasTools => {
  const session = useRef<StrokeSession | null>(null);
  const [live, setLive] = useState<ImageData | null>(null);

  const pixelAt = (event: PointerEvent<HTMLElement>): Point =>
    clampPoint(viewport.current?.screenToPixel(event.clientX, event.clientY) ?? { x: 0, y: 0 });

  const finish = (): void => {
    const done = session.current;
    session.current = null;
    setLive(null);
    if (done) commitStroke(done);
  };

  return {
    live,
    onPointerDown: (event) => {
      const target = currentTarget();
      const plan = pressPlan(useToolStore.getState().tool, event);
      const at = pixelAt(event);
      if (!target || !plan || !insideSprite(target, at) || !allowPress(plan, target)) return;
      if (plan.kind !== 'stroke') {
        runInstant(plan.kind, target, at, plan.slot);
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      const started = startStroke(plan, target, at);
      session.current = started;
      setLive(new ImageData(started.rgba, started.width, started.height));
    },
    onPointerMove: (event) => {
      if (!session.current) return;
      extendStroke(session.current, pixelAt(event));
      viewport.current?.redraw();
    },
    onPointerUp: finish,
    onContextMenu: (event) => event.preventDefault(),
  };
};

export { useCanvasTools };
