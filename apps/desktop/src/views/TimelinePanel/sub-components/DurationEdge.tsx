/* @layer renderer-app @kind component */
import { Box } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import type { PointerEvent } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import type { DurationDraft } from '../../../timeline/duration-draft.type';
import { scaleDurationsOf } from '../../../timeline/scale-durations';
import { setDurationOf } from '../../../timeline/set-duration';
import { snapDuration } from '../../../timeline/snap-duration';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { DurationEdgeProps } from '../TimelinePanel.type';

interface Grab {
  x: number;
  ms: number;
}

const DurationEdge = ({ id, durationMs, pxPerMs, onDraft }: DurationEdgeProps) => {
  const grab = useRef<Grab | null>(null);
  const draftOf = (event: PointerEvent<HTMLElement>): DurationDraft | null => {
    const start = grab.current;
    if (!start) return null;
    const state = useTimelineStore.getState();
    const ms = snapDuration(start.ms + (event.clientX - start.x) / pxPerMs, state.units, event.shiftKey);
    const picked = state.selection.frames;
    const scales = event.altKey && picked.length > 1 && picked.includes(id);
    return { ids: scales ? picked : [id], lead: id, ms, factor: scales ? ms / start.ms : 1 };
  };
  return (
    <Box
      className="frame-option__edge"
      role="presentation"
      title={TIMELINE_PANEL_TEXT.resizeDuration}
      onPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        grab.current = { x: event.clientX, ms: durationMs };
      }}
      onPointerMove={(event) => {
        const draft = draftOf(event);
        if (draft) onDraft(draft);
      }}
      onPointerUp={(event) => {
        const draft = draftOf(event);
        grab.current = null;
        onDraft(null);
        if (!draft) return;
        if (draft.ids.length > 1) scaleDurationsOf(draft.ids, draft.factor);
        else if (draft.ms !== durationMs) setDurationOf([id], draft.ms);
      }}
      onPointerCancel={() => {
        grab.current = null;
        onDraft(null);
      }}
      onClick={(event) => event.stopPropagation()}
    />
  );
};

export { DurationEdge };
