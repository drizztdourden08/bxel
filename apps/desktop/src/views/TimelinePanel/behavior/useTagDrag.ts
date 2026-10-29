/* @layer renderer-app @kind hook */
import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { indexAtX } from '../../../timeline/index-at-x';
import { addTag } from '../../../timeline/add-tag';
import { setTagSpan } from '../../../timeline/set-tag-span';
import type { TrackLayout } from '../../../timeline/track-layout.type';
import type { Hold, TagDrag, TagDraft } from './useTagDrag.type';

const useTagDrag = (layout: TrackLayout, count: number, content: React.RefObject<HTMLElement | null>): TagDrag => {
  const hold = useRef<Hold | null>(null);
  const [draft, setDraft] = useState<TagDraft | null>(null);
  const indexOf = (event: PointerEvent<HTMLElement>): number => {
    const left = content.current?.getBoundingClientRect().left ?? 0;
    return Math.min(count - 1, Math.max(0, indexAtX(layout, event.clientX - left)));
  };
  const shape = (state: Hold, index: number): TagDraft => {
    if (state.grip === 'create') return { tagId: null, start: Math.min(state.index, index), end: Math.max(state.index, index) };
    if (state.grip === 'start') return { tagId: state.tagId, start: Math.min(index, state.end), end: state.end };
    if (state.grip === 'end') return { tagId: state.tagId, start: state.start, end: Math.max(index, state.start) };
    const shift = Math.max(-state.start, Math.min(index - state.index, count - 1 - state.end));
    return { tagId: state.tagId, start: state.start + shift, end: state.end + shift };
  };
  return {
    draft,
    grab: (bar, event, grip) => {
      if (event.button !== 0 || bar.mirror) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      hold.current = { tagId: bar.tagId, grip, index: indexOf(event), start: bar.start, end: bar.end, moved: false };
    },
    create: (event) => {
      if (event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      const index = indexOf(event);
      hold.current = { tagId: null, grip: 'create', index, start: index, end: index, moved: false };
    },
    move: (event) => {
      const state = hold.current;
      if (!state) return;
      const index = indexOf(event);
      if (index !== state.index || state.moved) {
        state.moved = true;
        setDraft(shape(state, index));
      }
    },
    release: (event) => {
      const state = hold.current;
      hold.current = null;
      setDraft(null);
      if (!state?.moved) return false;
      const done = shape(state, indexOf(event));
      if (state.grip === 'create') addTag({ start: done.start, end: done.end });
      else if (state.tagId !== null) setTagSpan(state.tagId, done.start, done.end);
      return true;
    },
  };
};

export { useTagDrag };
