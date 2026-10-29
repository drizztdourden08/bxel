/* @layer renderer-app @kind component */
import { Anchored, Box } from '@drizztdourden08/tessera';
import { useLayoutEffect, useRef, useState } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { spanTagOf } from '../../../timeline/span-tag-of';
import { tagById } from '../../../timeline/tag-by-id';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { TagPopoverProps } from '../TimelinePanel.type';
import { TagEditor } from './TagEditor';

const TagPopover = ({ focus, container }: TagPopoverProps) => {
  const popover = useTimelineStore((state) => state.popover);
  const setPopover = useTimelineStore((state) => state.setPopover);
  const picking = useTimelineStore((state) => state.colourPicker);
  const anchor = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);
  const tagId = popover?.kind === 'tag' ? popover.tagId : null;
  const tag = spanTagOf(focus.animation, tagById(focus.animation, tagId));
  useLayoutEffect(() => {
    anchor.current = tagId === null ? null : (container.current?.querySelector<HTMLElement>(`[data-tag-id="${tagId}"]`) ?? null);
    setReady(anchor.current !== null);
  }, [tagId, container, focus.animation]);
  if (tagId === null || !tag || !ready) return null;
  return (
    <Anchored anchorRef={anchor} placement="bottom-start" dismissOnOutsidePress={!picking} onDismiss={() => setPopover(null)} role="dialog" aria-label={TIMELINE_PANEL_TEXT.tagPopover} className="timeline-popover">
      <Box className="timeline-popover__surface">
        <TagEditor key={tag.id} tagId={tag.id} readOnly={focus.readOnly} />
      </Box>
    </Anchored>
  );
};

export { TagPopover };
