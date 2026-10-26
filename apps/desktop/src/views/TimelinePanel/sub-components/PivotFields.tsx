/* @layer renderer-app @kind component */
import { animFramePivot } from '@bxel/document';
import { Flex, Text } from '@drizztdourden08/tessera';
import { setPivot } from '../../../timeline/set-pivot';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { OFFSET_LIMIT, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { NumberField } from './NumberField';

const PivotFields = ({ focus }: FocusProps) => {
  const { frame, animation, artwork, readOnly } = focus;
  const placed = frame.spriteId !== null && !readOnly;
  const pivot = animFramePivot(artwork, animation, frame);
  return (
    <Flex gap="xs" align="center">
      <NumberField
        key={`${frame.id}:px:${pivot.x2}`}
        label={TIMELINE_TEXT.pivotX}
        value={pivot.x2 / 2}
        min={0}
        max={OFFSET_LIMIT}
        step={0.5}
        disabled={!placed}
        onCommit={(value) => setPivot(Math.round(value * 2), null)}
      />
      <NumberField
        key={`${frame.id}:py:${pivot.y2}`}
        label={TIMELINE_TEXT.pivotY}
        value={pivot.y2 / 2}
        min={0}
        max={OFFSET_LIMIT}
        step={0.5}
        disabled={!placed}
        onCommit={(value) => setPivot(null, Math.round(value * 2))}
      />
      <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.pixelUnit}</Text>
    </Flex>
  );
};

export { PivotFields };
