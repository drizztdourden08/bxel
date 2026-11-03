/* @layer renderer-app @kind component */
import { Box, MarqueeBox, VirtualList, useMarqueeSelect } from '@drizztdourden08/tessera';
import type { VirtualListHandle } from '@drizztdourden08/tessera';
import { useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { dropFrames } from '../../../timeline/drag-frame';
import { selectFrameIds } from '../../../timeline/select-frame-ids';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { dropLabel } from '../behavior/drop-label';
import { keyOwner } from '../behavior/key-owner';
import { trackRects } from '../behavior/track-rects';
import { useFrameSelection } from '../behavior/useFrameSelection';
import { useStripFocus } from '../behavior/useStripFocus';
import { useTrackDrop } from '../behavior/useTrackDrop';
import { END_GUTTER } from '../TimelinePanel.constants';
import type { TrackProps } from '../TimelinePanel.type';
import { FrameOption } from './FrameOption';
import { MARQUEE_ITEM } from './FrameTrack.constants';
import { GhostThumb } from './GhostThumb';

const FrameTrack = ({ focus, model, layout, thumb, onDraft, scroller }: TrackProps) => {
  const trackRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const list = useRef<VirtualListHandle>(null);
  const selection = useFrameSelection(focus);
  const refused = useTrackDrop(trackRef, focus);
  const selected = useTimelineStore((state) => state.selection.frames);
  const widthsKey = useMemo(() => layout.widths.join(','), [layout.widths]);
  const marquee = useMarqueeSelect({
    containerRef: scroller,
    itemSelector: MARQUEE_ITEM,
    selected,
    getRects: () => trackRects(list.current, rootRef.current, scroller.current),
    onChange: (keys) => {
      const ids = focus.animation.frames.map((frame) => frame.id).filter((id) => keys.includes(id));
      if (ids.length > 0) selectFrameIds(ids, ids.includes(focus.frame.id) ? focus.frame.id : undefined);
    },
  });
  useStripFocus(rootRef, focus.frame.id);
  return (
    <Box
      ref={trackRef}
      className="frame-track"
      style={{ inlineSize: layout.total + END_GUTTER, '--frame-thumb': `${thumb}px` } as CSSProperties}
      data-refused={refused ?? undefined}
      {...marquee.bind}
    >
      <VirtualList
        ref={list}
        scrollRef={rootRef}
        className="frame-list"
        orientation="horizontal"
        label={TIMELINE_TEXT.strip}
        items={model.cells}
        getKey={(cell) => cell.id}
        itemSize={(index) => layout.widths[index] ?? 0}
        itemSizeKey={widthsKey}
        endGutter={END_GUTTER}
        current={focus.frame.id}
        selection={selection}
        ownsKey={keyOwner}
        reorder={{
          onMove: ({ keys, to, modifier }) => void dropFrames({ keys, before: to, modifier }),
          renderThumbnail: (cell) => <GhostThumb focus={focus} frameId={cell.id} />,
          dropLabel,
        }}
        renderOption={(cell, index, bind) => (
          <FrameOption focus={focus} cell={cell} index={index} bind={bind} layout={layout} thumb={thumb} onDraft={onDraft} />
        )}
      />
      <MarqueeBox rect={marquee.rect} />
    </Box>
  );
};

export { FrameTrack };
