/* @layer renderer-app @kind hook */
import { useRef } from 'react';
import type { PointerEvent } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { indexAtX } from '../../../timeline/index-at-x';
import type { TrackLayout } from '../../../timeline/track-layout.type';
import type { AnimationFocus } from '../../../timeline/timeline.type';
import { scrubTarget } from './scrub-target';
import type { Scrub } from './useScrub.type';

const useScrub = (focus: AnimationFocus, layout: TrackLayout, setLoopDraft: (range: { from: number; to: number } | null) => void): Omit<Scrub, 'loop'> => {
  const origin = useRef<{ index: number; shift: boolean } | null>(null);
  const { frames } = focus.animation;
  const at = (event: PointerEvent<HTMLElement>): number => {
    const box = event.currentTarget.getBoundingClientRect();
    return Math.min(frames.length - 1, Math.max(0, indexAtX(layout, event.clientX - box.left)));
  };
  const move = (index: number): void => {
    const frame = frames[index];
    if (frame && frame.id !== useTimelineStore.getState().frameId) useTimelineStore.getState().setPlayhead(frame.id);
  };
  return {
    onPointerDown: (event) => {
      if (event.button !== 0) return;
      const index = at(event);
      event.currentTarget.setPointerCapture(event.pointerId);
      origin.current = { index, shift: event.shiftKey };
      if (event.shiftKey) setLoopDraft({ from: index, to: index });
      else move(index);
    },
    onPointerMove: (event) => {
      const start = origin.current;
      if (!start) return;
      if (start.shift) setLoopDraft({ from: start.index, to: at(event) });
      else move(at(event));
    },
    onPointerUp: (event) => {
      const start = origin.current;
      origin.current = null;
      if (!start?.shift) return;
      const to = at(event);
      setLoopDraft(null);
      const from = frames[Math.min(start.index, to)];
      const last = frames[Math.max(start.index, to)];
      if (from && last && from.id !== last.id) useTimelineStore.getState().setLoopRange({ from: from.id, to: last.id });
    },
    onKeyDown: (event) => {
      const current = frames.findIndex((frame) => frame.id === focus.frame.id);
      const next = scrubTarget(event.key, current, frames.length - 1);
      if (next === null || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      event.stopPropagation();
      move(Math.min(frames.length - 1, Math.max(0, next)));
    },
  };
};

export { useScrub };
