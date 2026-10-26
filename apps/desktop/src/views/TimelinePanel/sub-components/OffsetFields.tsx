/* @layer renderer-app @kind component */
import { Flex, Text } from '@drizztdourden08/tessera';
import { setOffset } from '../../../timeline/set-offset';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { OFFSET_LIMIT, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { NumberField } from './NumberField';

const OffsetFields = ({ focus }: FocusProps) => {
  const { frame, readOnly } = focus;
  const placed = frame.spriteId !== null && !readOnly;
  return (
    <Flex gap="xs" align="center">
      <NumberField
        key={`${frame.id}:x:${frame.offset.x}`}
        label={TIMELINE_TEXT.offsetX}
        value={frame.offset.x}
        min={-OFFSET_LIMIT}
        max={OFFSET_LIMIT}
        step={1}
        disabled={!placed}
        onCommit={(value) => setOffset(Math.round(value), frame.offset.y)}
      />
      <NumberField
        key={`${frame.id}:y:${frame.offset.y}`}
        label={TIMELINE_TEXT.offsetY}
        value={frame.offset.y}
        min={-OFFSET_LIMIT}
        max={OFFSET_LIMIT}
        step={1}
        disabled={!placed}
        onCommit={(value) => setOffset(frame.offset.x, Math.round(value))}
      />
      <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.pixelUnit}</Text>
    </Flex>
  );
};

export { OffsetFields };
