/* @layer renderer-app @kind component */
import { Box, Text } from '@drizztdourden08/tessera';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { frameOptionData } from '../behavior/frame-option-data';
import type { FrameOptionProps } from '../TimelinePanel.type';
import { DurationChip } from './DurationChip';
import { DurationEdge } from './DurationEdge';
import { FrameBadges } from './FrameBadges';
import { FrameThumb } from './FrameThumb';

const FrameOption = ({ focus, cell, index, bind, layout, thumb, onDraft }: FrameOptionProps) => {
  const timeMode = useTimelineStore((state) => state.timeMode);
  const width = layout.widths[index] ?? 0;
  const narrow = width < 36;
  const well = Math.min(thumb, width - 4);
  return (
    <Box {...bind} id={`frame-option-${cell.id}`} className={`${bind.className} frame-option`} aria-label={cell.label} {...frameOptionData(cell)}>
      <Box className="frame-option__well" style={{ inlineSize: well, blockSize: well }}>
        <FrameThumb focus={focus} cell={cell} thumb={well} />
        <FrameBadges cell={cell} />
      </Box>
      <Box className="frame-option__meta">
        <Text as="span" variant="caption" numeric className="frame-option__number">{cell.number}</Text>
        {!narrow && <DurationChip id={cell.id} durationMs={cell.durationMs} readOnly={focus.readOnly} />}
      </Box>
      <Box className="frame-option__link" aria-hidden="true" />
      {timeMode && !focus.readOnly && <DurationEdge id={cell.id} durationMs={cell.durationMs} pxPerMs={layout.pxPerMs} onDraft={onDraft} />}
    </Box>
  );
};

export { FrameOption };
