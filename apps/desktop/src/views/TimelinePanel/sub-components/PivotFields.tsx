/* @layer renderer-app @kind component */
import { animFramePivot } from '@bxel/document';
import { currentSelection } from '../../../timeline/current-selection';
import { setPivot } from '../../../timeline/set-pivot';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { OFFSET_LIMIT, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { AxisFields } from './AxisFields';

const PivotFields = ({ focus }: FocusProps) => {
  const { frame, animation, artwork, readOnly } = focus;
  const pivot = animFramePivot(artwork, animation, frame);
  const picked = currentSelection(focus);
  const pivots = animation.frames.filter((each) => picked.includes(each.id) && each.spriteId !== null).map((each) => animFramePivot(artwork, animation, each));
  const mixedX = new Set(pivots.map((each) => each.x2)).size > 1;
  const mixedY = new Set(pivots.map((each) => each.y2)).size > 1;
  return (
    <AxisFields
      caption={TIMELINE_PANEL_TEXT.pivotCaption}
      frameId={`${picked.join(',')}:${mixedX}:${mixedY}`}
      x={{ label: TIMELINE_TEXT.pivotX, value: pivot.x2 / 2, mixed: mixedX, onCommit: (value) => setPivot(Math.round(value * 2), null) }}
      y={{ label: TIMELINE_TEXT.pivotY, value: pivot.y2 / 2, mixed: mixedY, onCommit: (value) => setPivot(null, Math.round(value * 2)) }}
      min={0}
      max={OFFSET_LIMIT}
      step={0.5}
      disabled={frame.spriteId === null || readOnly}
    />
  );
};

export { PivotFields };
