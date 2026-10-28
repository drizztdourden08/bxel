/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { dropPosition } from '../../../timeline/drop-position';
import { goToFrame } from '../../../timeline/go-to-frame';
import { frameOptionData } from '../behavior/frame-option-data';
import type { FrameOptionProps } from '../TimelinePanel.type';
import { DurationChip } from './DurationChip';
import { DurationEdge } from './DurationEdge';
import { DROP_TEXT } from './FrameOption.constants';
import { FrameBadges } from './FrameBadges';
import { FrameThumb } from './FrameThumb';

const FrameOption = ({ focus, cell, index, total, drag, mode, layout, thumb, onDraft }: FrameOptionProps) => {
  const timeMode = useTimelineStore((state) => state.timeMode);
  const mark = drag.dropMark(index, total);
  const width = layout.widths[index] ?? 0;
  const narrow = width < 36;
  return (
    <Box
      role="option"
      id={`frame-option-${cell.id}`}
      className="frame-option"
      style={{ inlineSize: width }}
      tabIndex={cell.current ? 0 : -1}
      aria-label={cell.label}
      aria-selected={cell.selected}
      aria-current={cell.current ? 'true' : undefined}
      aria-posinset={cell.number}
      aria-setsize={total}
      {...frameOptionData(cell, index, mark, drag.dragging === index)}
      onClick={(event) => goToFrame(cell.id, event.shiftKey, event.ctrlKey || event.metaKey)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget || event.key !== ' ') return;
        event.preventDefault();
        goToFrame(cell.id, false, true);
      }}
      {...drag.handlers(index)}
    >
      <Box className="frame-option__well" style={{ inlineSize: Math.min(thumb, width - 4), blockSize: Math.min(thumb, width - 4) }}>
        <FrameThumb focus={focus} cell={cell} thumb={Math.min(thumb, width - 4)} />
        <FrameBadges cell={cell} />
      </Box>
      <Box className="frame-option__meta">
        <Text as="span" variant="caption" numeric className="frame-option__number">{cell.number}</Text>
        {!narrow && <DurationChip id={cell.id} durationMs={cell.durationMs} readOnly={focus.readOnly} />}
      </Box>
      <Box className="frame-option__link" aria-hidden="true" />
      {timeMode && !focus.readOnly && <DurationEdge id={cell.id} durationMs={cell.durationMs} pxPerMs={layout.pxPerMs} onDraft={onDraft} />}
      {mark !== undefined && (
        <Text as="span" variant="caption" className="frame-option__drop-label" data-side={mark}>
          {DROP_TEXT[mode](dropPosition(mode === 'move' ? drag.dragging : null, index, mark))}
        </Text>
      )}
    </Box>
  );
};

export { FrameOption };
