/* @layer renderer-app @kind component */
import { setOffset } from '../../../timeline/set-offset';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { OFFSET_LIMIT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { AxisFields } from './AxisFields';

const OffsetFields = ({ focus }: FocusProps) => {
  const { frame, readOnly } = focus;
  return (
    <AxisFields
      frameId={frame.id}
      x={{ label: TIMELINE_TEXT.offsetX, value: frame.offset.x, onCommit: (value) => setOffset(Math.round(value), frame.offset.y) }}
      y={{ label: TIMELINE_TEXT.offsetY, value: frame.offset.y, onCommit: (value) => setOffset(frame.offset.x, Math.round(value)) }}
      min={-OFFSET_LIMIT}
      max={OFFSET_LIMIT}
      step={1}
      disabled={frame.spriteId === null || readOnly}
    />
  );
};

export { OffsetFields };
