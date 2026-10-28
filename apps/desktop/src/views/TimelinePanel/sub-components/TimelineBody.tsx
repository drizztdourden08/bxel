/* @layer renderer-app @kind component */
import { Box, ScrollArea } from '@drizztdourden08/tessera';
import { useMemo, useRef, useState } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { draftedDurations } from '../../../timeline/drafted-durations';
import type { DurationDraft } from '../../../timeline/duration-draft.type';
import { fitThumb, trackLayout } from '../../../timeline/track-layout';
import { useKeepCurrentVisible } from '../behavior/useKeepCurrentVisible';
import { useWheelZoom } from '../behavior/useWheelZoom';
import { END_GUTTER } from '../TimelinePanel.constants';
import type { BodyProps } from '../TimelinePanel.type';
import { FrameTrack } from './FrameTrack';
import { TagLanes } from './TagLanes';
import { TimelineRuler } from './TimelineRuler';

const TimelineBody = ({ focus, model, width }: BodyProps) => {
  const zoom = useTimelineStore((state) => state.zoom);
  const timeMode = useTimelineStore((state) => state.timeMode);
  const fit = useTimelineStore((state) => state.fit);
  const [draft, setDraft] = useState<DurationDraft | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const { frames } = focus.animation;
  const durations = useMemo(() => draftedDurations(frames, draft), [frames, draft]);
  const thumb = fit ? fitThumb(durations, Math.max(0, width - END_GUTTER), timeMode) : zoom;
  const layout = useMemo(() => trackLayout(durations, thumb, timeMode), [durations, thumb, timeMode]);
  useWheelZoom(scroller);
  useKeepCurrentVisible(scroller, focus.frame.id, thumb);
  return (
    <ScrollArea ref={scroller} axis="both" scrollbar="slim" fade={false} className="timeline__body">
      <Box className="timeline__content" style={{ inlineSize: layout.total + END_GUTTER }}>
        <TimelineRuler focus={focus} layout={layout} thumb={thumb} model={model} />
        <TagLanes focus={focus} layout={layout} thumb={thumb} model={model} />
        <FrameTrack focus={focus} layout={layout} thumb={thumb} model={model} scroller={scroller} onDraft={setDraft} />
      </Box>
    </ScrollArea>
  );
};

export { TimelineBody };
