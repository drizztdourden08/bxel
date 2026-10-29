/* @layer renderer-app @kind component */
import { Anchored, Box } from '@drizztdourden08/tessera';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FramePopoverProps } from '../TimelinePanel.type';
import { DurationPopover } from './DurationPopover';
import { PositionPopover } from './PositionPopover';

const FramePopover = ({ focus, container }: FramePopoverProps) => {
  const popover = useTimelineStore((state) => state.popover);
  const setPopover = useTimelineStore((state) => state.setPopover);
  const anchor = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const kind = popover?.kind === 'duration' || popover?.kind === 'position' ? popover.kind : null;
  useLayoutEffect(() => {
    anchor.current = kind === null ? null : (container.current?.querySelector<HTMLElement>('.timeline__picked') ?? null);
    setReady(anchor.current !== null);
  }, [kind, container]);
  if (kind === null || !ready) return null;
  return (
    <Anchored anchorRef={anchor} placement="top-start" onDismiss={() => setPopover(null)} role="dialog" aria-label={kind === 'duration' ? TIMELINE_PANEL_TEXT.setDuration : TIMELINE_PANEL_TEXT.toPosition} className="timeline-popover">
      <Box className="timeline-popover__surface">{kind === 'duration' ? <DurationPopover focus={focus} /> : <PositionPopover focus={focus} />}</Box>
    </Anchored>
  );
};

export { FramePopover };
