/* @layer renderer-app @kind component */
import { Box, Pressable, Text } from '@drizztdourden08/tessera';
import { goToFrame } from '../../../timeline/go-to-frame';
import { BADGE_TEXT } from '../../../timeline/timeline.constants';
import type { FrameCellViewProps } from '../TimelinePanel.type';
import { FrameThumb } from './FrameThumb';

const FrameCellView = ({ focus, cell, index, total, drag }: FrameCellViewProps) => (
  <Box
    role="listitem"
    className="frame-cell"
    data-reorder-index={index}
    data-reorder-key={cell.id}
    data-drop={drag.dropMark(index, total)}
    data-dragging={drag.dragging === index ? 'yes' : undefined}
    data-current={cell.current ? 'yes' : 'no'}
    data-selected={cell.selected ? 'yes' : 'no'}
  >
    <Pressable
      className="frame-cell__button"
      tabIndex={cell.current ? 0 : -1}
      data-roving={cell.current ? 'yes' : 'no'}
      aria-label={cell.label}
      aria-current={cell.current ? 'true' : undefined}
      aria-pressed={cell.selected}
      onClick={(event) => goToFrame(cell.id, event.shiftKey, event.ctrlKey || event.metaKey)}
      {...drag.handlers(index)}
    >
      <FrameThumb focus={focus} cell={cell} />
      <Text as="span" variant="caption" numeric>{cell.number}</Text>
      <Text as="span" variant="caption" tone="muted" numeric>{cell.durationMs}</Text>
      <Box className="frame-cell__badges">
        {cell.badges.map((badge) => (
          <Text key={badge} as="span" variant="caption" className="frame-cell__badge" data-badge={badge}>{BADGE_TEXT[badge]}</Text>
        ))}
      </Box>
    </Pressable>
  </Box>
);

export { FrameCellView };
