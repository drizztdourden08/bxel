/* @layer renderer-app @kind component */
import { animFramePivot } from '@bxel/document';
import { setPivot } from '../../../timeline/set-pivot';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { OFFSET_LIMIT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { AxisFields } from './AxisFields';

const PivotFields = ({ focus }: FocusProps) => {
  const { frame, animation, artwork, readOnly } = focus;
  const pivot = animFramePivot(artwork, animation, frame);
  return (
    <AxisFields
      frameId={frame.id}
      x={{ label: TIMELINE_TEXT.pivotX, value: pivot.x2 / 2, onCommit: (value) => setPivot(Math.round(value * 2), null) }}
      y={{ label: TIMELINE_TEXT.pivotY, value: pivot.y2 / 2, onCommit: (value) => setPivot(null, Math.round(value * 2)) }}
      min={0}
      max={OFFSET_LIMIT}
      step={0.5}
      disabled={frame.spriteId === null || readOnly}
    />
  );
};

export { PivotFields };
