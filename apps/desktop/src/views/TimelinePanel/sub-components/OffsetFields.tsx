/* @layer renderer-app @kind component */
import { setOffset } from '../../../timeline/set-offset';
import { currentSelection } from '../../../timeline/current-selection';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { OFFSET_LIMIT, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { AxisFields } from './AxisFields';

const OffsetFields = ({ focus }: FocusProps) => {
  const { frame, readOnly } = focus;
  const picked = currentSelection(focus);
  const frames = focus.animation.frames.filter((each) => picked.includes(each.id) && each.spriteId !== null);
  const mixedX = new Set(frames.map((each) => each.offset.x)).size > 1;
  const mixedY = new Set(frames.map((each) => each.offset.y)).size > 1;
  return (
    <AxisFields
      caption={TIMELINE_PANEL_TEXT.offsetCaption}
      frameId={`${picked.join(',')}:${mixedX}:${mixedY}`}
      x={{ label: TIMELINE_TEXT.offsetX, value: frame.offset.x, mixed: mixedX, onCommit: (value) => setOffset(Math.round(value), null) }}
      y={{ label: TIMELINE_TEXT.offsetY, value: frame.offset.y, mixed: mixedY, onCommit: (value) => setOffset(null, Math.round(value)) }}
      min={-OFFSET_LIMIT}
      max={OFFSET_LIMIT}
      step={1}
      disabled={frame.spriteId === null || readOnly}
    />
  );
};

export { OffsetFields };
