/* @layer renderer-app @kind component */
import { useRef } from 'react';
import { Box, REORDER_ITEM_SELECTOR, ScrollArea, useReorderDrag } from '@drizztdourden08/tessera';
import { dragFrame } from '../../../timeline/drag-frame';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { useStripFocus } from '../behavior/useStripFocus';
import { useStripDrop } from '../behavior/useStripDrop';
import type { FrameStripProps } from '../TimelinePanel.type';
import { FrameCellView } from './FrameCellView';
import { TagLane } from './TagLane';

const FrameStrip = ({ focus, model }: FrameStripProps) => {
  const stripRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLElement>(null);
  const drag = useReorderDrag({ listRef, selector: REORDER_ITEM_SELECTOR, axis: 'horizontal', onDrop: dragFrame });
  const drop = useStripDrop(focus);
  useStripFocus(stripRef, focus.frame.id);
  return (
    <ScrollArea ref={stripRef} axis="x" scrollbar="slim" className="frame-strip" role="group" aria-label={TIMELINE_TEXT.strip} {...drop}>
      {model.tagLanes.map((cells, lane) => (
        <TagLane key={lane} cells={cells} />
      ))}
      <Box role="list" ref={listRef} aria-label={TIMELINE_TEXT.strip} className="frame-strip__row frame-strip__row--frames">
        {model.cells.map((cell, index) => (
          <FrameCellView key={cell.id} focus={focus} cell={cell} index={index} total={model.cells.length} drag={drag} />
        ))}
      </Box>
    </ScrollArea>
  );
};

export { FrameStrip };
