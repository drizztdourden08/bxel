/* @layer renderer-app @kind component */
import { MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import { Flex, Text } from '@drizztdourden08/tessera';
import { setDuration } from '../../../timeline/set-duration';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { DURATION_STEP, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { NumberField } from './NumberField';

const DurationFields = ({ focus }: FocusProps) => {
  const { frame, readOnly } = focus;
  return (
    <Flex gap="xs" align="center">
      <NumberField
        key={`${frame.id}:duration:${frame.durationMs}`}
        label={TIMELINE_TEXT.duration}
        value={frame.durationMs}
        min={MIN_DURATION_MS}
        max={MAX_DURATION_MS}
        step={DURATION_STEP}
        disabled={readOnly}
        onCommit={setDuration}
      />
      <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.durationUnit}</Text>
    </Flex>
  );
};

export { DurationFields };
