/* @layer renderer-app @kind component */
import { useState } from 'react';
import { MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import { Flex, NumberInput, Text } from '@drizztdourden08/tessera';
import { DURATION_STEP, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { DurationFieldProps } from '../TimelinePanel.type';

const DurationField = ({ value, onCommit }: DurationFieldProps) => {
  const [draft, setDraft] = useState(value);
  const commit = (): void => {
    if (draft !== value && !onCommit(draft)) setDraft(value);
  };
  return (
    <Flex gap="xs" align="center">
      <NumberInput
        size="sm"
        sizeToContent
        min={MIN_DURATION_MS}
        max={MAX_DURATION_MS}
        step={DURATION_STEP}
        value={draft}
        aria-label={TIMELINE_PANEL_TEXT.durationLabel}
        onChange={setDraft}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') commit();
        }}
      />
      <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.durationUnit}</Text>
    </Flex>
  );
};

export { DurationField };
