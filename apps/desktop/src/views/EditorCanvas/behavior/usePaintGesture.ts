/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { allowPress } from '../../../editor/allow-press';
import { cancelDraft, commitDraft } from '../../../editor/commit-draft';
import { currentTarget } from '../../../editor/current-target';
import type { PaintSession } from '../../../editor/editor.type';
import { endGesture } from '../../../editor/end-gesture';
import { foldToSprite } from '../../../editor/fold-to-sprite';
import { gesture } from '../../../editor/gesture-state';
import { handOffImage } from '../../../editor/hand-off-image';
import { insidePaintArea } from '../../../editor/inside-paint-area';
import { pathDraft } from '../../../editor/path-draft';
import { addVertex, endCurveDrag, hoverPath } from '../../../editor/path-session';
import { pressPlan } from '../../../editor/press-plan';
import { runInstant } from '../../../editor/run-instant';
import { startSession } from '../../../editor/start-session';
import { tickSpray } from '../../../editor/spray-session';
import { SPRAY_TICK_MS } from '../../../stores/drawing-store.constants';
import { useLivePaintStore } from '../../../stores/useLivePaintStore';
import { useGestureStore } from '../../../stores/useGestureStore';
import { useToolStore } from '../../../stores/useToolStore';
import type { PixelViewportHandle } from '../../PixelViewport';
import type { PaintGesture } from './canvas-tools.type';
import { moveSession } from './move-session';
import { pixelAtEvent } from './pixel-at-event';
import { useDraftKeys } from './useDraftKeys';
import { zoomAtPointer } from './zoom-at-pointer';

const usePaintGesture = (viewport: RefObject<PixelViewportHandle | null>): PaintGesture => {
  const session = useRef<PaintSession | null>(null);
  const image = useRef<ImageData | null>(null);
  const timer = useRef<number | null>(null);
  const [live, setLive] = useState<ImageData | null>(null);

  const show = useCallback((shown: PaintSession): void => {
    image.current = new ImageData(shown.rgba, shown.width, shown.height);
    useLivePaintStore.getState().start(shown);
    setLive(image.current);
  }, []);

  const clear = useCallback((): void => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
    session.current = null;
    image.current = null;
    gesture.dragging = false;
    gesture.space = false;
    useGestureStore.getState().setHint('');
    useLivePaintStore.getState().end();
    setLive(null);
  }, []);

  const cancel = useCallback((): void => {
    cancelDraft();
    clear();
    viewport.current?.redraw();
  }, [clear, viewport]);

  const finish = useCallback((): void => {
    const shown = image.current;
    const done = commitDraft();
    clear();
    if (done && shown) handOffImage(done.session, shown, done.result);
    viewport.current?.redraw();
  }, [clear, viewport]);

  const redraw = useCallback((): void => viewport.current?.redraw(), [viewport]);
  useDraftKeys({ finish, cancel, redraw });

  useEffect(
    () =>
      useToolStore.subscribe((state, previous) => {
        if (state.tool !== previous.tool && pathDraft.current) cancel();
      }),
    [cancel],
  );
  useEffect(() => clear, [clear]);

  const continueDraft = (draft: NonNullable<typeof pathDraft.current>, at: { x: number; y: number }, detail: number, shift: boolean): void => {
    if (draft.tool === 'polygon') {
      if (detail >= 2) finish();
      else addVertex(draft, at, shift);
    } else if (draft.tool === 'curve') {
      hoverPath(draft, at, false);
      finish();
    }
    viewport.current?.redraw();
  };

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
      const draft = pathDraft.current;
      if (draft && plan.kind === 'path' && plan.tool === draft.tool && (draft.tool === 'polygon' || draft.phase === 'bend')) {
        continueDraft(draft, at, event.detail, event.shiftKey);
        return;
      }
      if (draft) cancel();
      event.currentTarget.setPointerCapture(event.pointerId);
      const started = startSession(plan, target, at);
      session.current = started;
      gesture.dragging = started.kind === 'shape';
      if (started.kind === 'path') pathDraft.current = started;
      if (started.kind === 'spray') timer.current = window.setInterval(() => {
        const active = session.current;
        if (active?.kind === 'spray') {
          tickSpray(active);
          viewport.current?.redraw();
        }
      }, SPRAY_TICK_MS);
      show(started);
    },
    move: (event) => {
      const active = session.current ?? pathDraft.current;
      if (!active) return;
      const at = pixelAtEvent(viewport.current, event);
      if (session.current || event.buttons === 0) moveSession(active, at, event);
      viewport.current?.redraw();
      useLivePaintStore.getState().update();
    },
    up: () => {
      const done = session.current;
      if (!done) return;
      if (done.kind === 'path' && done.tool !== 'contour') {
        session.current = null;
        gesture.dragging = false;
        if (done.tool === 'curve') {
          const flat = done.hover.x === (done.vertices[0]?.x ?? done.hover.x) && done.hover.y === (done.vertices[0]?.y ?? done.hover.y);
          if (flat) cancel();
          else endCurveDrag(done);
        }
        viewport.current?.redraw();
        return;
      }
      if (done.kind === 'path') {
        finish();
        return;
      }
      const shown = image.current;
      clear();
      const result = endGesture(done);
      if (shown && result) handOffImage(done, shown, result);
    },
  };
};

export { usePaintGesture };
