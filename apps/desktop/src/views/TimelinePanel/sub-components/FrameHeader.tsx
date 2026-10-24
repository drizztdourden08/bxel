/* @layer renderer-app @kind component */
import { Box, Pressable, Text } from '@drizztdourden08/tessera';
import { goToFrame } from '../../../timeline/go-to-frame';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import type { FrameHeaderProps } from '../TimelinePanel.type';

const FrameHeader = ({ column, index, total, drag }: FrameHeaderProps) => (
  <Box
    role="columnheader"
    aria-selected={column.selected}
    className="timeline-head"
    data-reorder-index={index}
    data-reorder-key={column.id}
    data-drop={drag.dropMark(index, total)}
    data-dragging={drag.dragging === index ? 'yes' : undefined}
    data-current={column.current ? 'yes' : 'no'}
    data-selected={column.selected ? 'yes' : 'no'}
  >
    <Pressable
      className="timeline-head__button"
      tabIndex={-1}
      aria-label={TIMELINE_TEXT.frameLabel(column.number, column.durationMs)}
      onClick={(event) => goToFrame(column.id, event.shiftKey)}
      {...drag.handlers(index)}
    >
      <Text as="span" variant="caption" numeric>{column.number}</Text>
      <Text as="span" variant="caption" tone="muted" numeric>{column.durationMs}</Text>
    </Pressable>
  </Box>
);

export { FrameHeader };
