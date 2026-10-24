/* @layer renderer-app @kind component */
import { useRef } from 'react';
import { Box, ScrollArea, REORDER_ITEM_SELECTOR, useReorderDrag } from '@drizztdourden08/tessera';
import { dragFrame } from '../../../timeline/drag-frame';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { useGridFocus } from '../behavior/useGridFocus';
import type { TimelineGridProps } from '../TimelinePanel.type';
import { FrameHeader } from './FrameHeader';
import { LayerRowView } from './LayerRowView';
import { TagLane } from './TagLane';

const TimelineGrid = ({ model, frameId }: TimelineGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLElement>(null);
  const drag = useReorderDrag({ listRef: headRef, selector: REORDER_ITEM_SELECTOR, axis: 'horizontal', onDrop: dragFrame });
  const active = model.rows.find((row) => row.active);
  useGridFocus(gridRef, `${frameId}:${active?.id}`);
  return (
    <ScrollArea
      ref={gridRef}
      axis="both"
      scrollbar="slim"
      role="grid"
      aria-label={TIMELINE_TEXT.grid}
      aria-colcount={model.columns.length}
      aria-rowcount={model.rows.length}
      className="timeline-grid"
      data-timeline-grid
    >
      {model.tagLanes.map((cells, lane) => (
        <TagLane key={lane} cells={cells} />
      ))}
      <Box role="row" ref={headRef} className="timeline-grid__row timeline-grid__row--head">
        <Box className="timeline-grid__corner" role="presentation" />
        {model.columns.map((column, index) => (
          <FrameHeader key={column.id} column={column} index={index} total={model.columns.length} drag={drag} />
        ))}
      </Box>
      {model.rows.map((row) => (
        <LayerRowView key={row.id} row={row} frameId={frameId} />
      ))}
    </ScrollArea>
  );
};

export { TimelineGrid };
