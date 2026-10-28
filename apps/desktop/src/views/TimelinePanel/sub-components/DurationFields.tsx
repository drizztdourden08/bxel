/* @layer renderer-app @kind component */
import { MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import { Flex, Text } from '@drizztdourden08/tessera';
import { currentSelection } from '../../../timeline/current-selection';
import { setDuration } from '../../../timeline/set-duration';
import { TIMELINE_TEXT } from '../../../timeline/timeline.constants';
import { DURATION_STEP, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';
import { NumberField } from './NumberField';

const DurationFields = ({ focus }: FocusProps) => {
  const { readOnly } = focus;
  const picked = currentSelection(focus);
  const durations = [...new Set(focus.animation.frames.filter((frame) => picked.includes(frame.id)).map((frame) => frame.durationMs))];
  const mixed = durations.length > 1;
  const shown = durations[0] ?? focus.frame.durationMs;
  return (
    <Flex gap="xs" align="center">
      <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.durationCaption}</Text>
      <NumberField
        key={`${picked.join(',')}:duration:${mixed ? 'mixed' : shown}`}
        label={TIMELINE_TEXT.duration}
        value={shown}
        min={MIN_DURATION_MS}
        max={MAX_DURATION_MS}
        step={DURATION_STEP}
        disabled={readOnly}
        mixed={mixed}
        onCommit={setDuration}
      />
      <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.durationUnit}</Text>
    </Flex>
  );
};

export { DurationFields };
