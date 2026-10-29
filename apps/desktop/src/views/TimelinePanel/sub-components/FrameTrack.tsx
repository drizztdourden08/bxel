/* @layer renderer-app @kind component */
import { Box, DragGhost, MarqueeBox, REORDER_ITEM_SELECTOR, useMarqueeSelect, useReorderDrag } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import type { AnimFrameId } from '@bxel/document';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { dropFrames } from '../../../timeline/drag-frame';
import { selectFrameIds } from '../../../timeline/select-frame-ids';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { useDragMode } from '../behavior/useDragMode';
import { useFrameSelection } from '../behavior/useFrameSelection';
import { useFileDrop } from '../behavior/useFileDrop';
import { useStripDrop } from '../behavior/useStripDrop';
import { useStripFocus } from '../behavior/useStripFocus';
import { END_GUTTER } from '../TimelinePanel.constants';
import type { TrackProps } from '../TimelinePanel.type';
import { FrameOption } from './FrameOption';
import { MARQUEE_ITEM } from './FrameTrack.constants';
import { GhostThumb } from './GhostThumb';

const FrameTrack = ({ focus, model, layout, thumb, onDraft, scroller }: TrackProps) => {
  const listRef = useRef<HTMLElement>(null);
  const modes = useDragMode(true);
  const { frames } = focus.animation;
  const drag = useReorderDrag({
    listRef,
    selector: REORDER_ITEM_SELECTOR,
    axis: 'horizontal',
    scrollRef: scroller,
    keys: (from) => {
      const held = frames[from]?.id;
      const picked = useTimelineStore.getState().selection.frames;
      if (held === undefined) return [];
      return picked.includes(held) ? picked : [held];
    },
    onDrop: (_from, _to, info) => dropFrames(info),
  });
  const selection = useFrameSelection(focus);
  const drop = useStripDrop(focus);
  const refused = useFileDrop(listRef, focus);
  const selected = useTimelineStore((state) => state.selection.frames);
  const marquee = useMarqueeSelect({
    containerRef: scroller,
    itemSelector: MARQUEE_ITEM,
    selected,
    onChange: (keys) => {
      const ids = focus.animation.frames.map((frame) => frame.id).filter((id) => keys.includes(id));
      if (ids.length > 0) selectFrameIds(ids,ids.includes(focus.frame.id) ? focus.frame.id : undefined);
    },
  });
  useStripFocus(listRef, focus.frame.id);
  return (
    <Box
      role="listbox"
      ref={listRef}
      aria-label={TIMELINE_TEXT.strip}
      aria-orientation="horizontal"
      aria-multiselectable="true"
      className="frame-track"
      style={{ inlineSize: layout.total + END_GUTTER }}
      data-drag-mode={modes.mode}
      data-refused={refused ?? undefined}
      {...drop}
      {...marquee.bind}
    >
      {model.cells.map((cell, index) => (
        <FrameOption key={cell.id} focus={focus} cell={cell} index={index} total={model.cells.length} drag={drag} selection={selection} mode={modes.mode} layout={layout} thumb={thumb} onDraft={onDraft} />
      ))}
      <MarqueeBox rect={marquee.rect} />
      <DragGhost
        count={drag.dragKeys.length}
        thumbnails={drag.dragKeys.slice(0, 3).map((key) => <GhostThumb key={key} focus={focus} frameId={key as AnimFrameId} />)}
        point={drag.point}
      />
    </Box>
  );
};

export { FrameTrack };
