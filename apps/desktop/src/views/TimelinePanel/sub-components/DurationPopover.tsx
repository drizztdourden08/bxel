/* @layer renderer-app @kind component */
import { MAX_DURATION_MS, MIN_DURATION_MS } from '@bxel/document';
import { Box, Button, Flex, NumberInput, Stack, Text, Toggle } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { scaleDurations } from '../../../timeline/scale-durations';
import { setDuration } from '../../../timeline/set-duration';
import { setSameFps } from '../../../timeline/set-same-fps';
import { focusFirstField } from '../behavior/focus-field';
import { DURATION_CHOICES, DURATION_STEP, SCALE_CHOICES, TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { FocusProps } from '../TimelinePanel.type';

const DurationPopover = ({ focus }: FocusProps) => {
  const close = useTimelineStore((state) => state.setPopover);
  const [ms, setMs] = useState(focus.frame.durationMs);
  const [fps, setFps] = useState(12);
  const [whole, setWhole] = useState(false);
  const [factor, setFactor] = useState(1.5);
  const done = (ok: boolean): void => {
    if (ok) close(null);
  };
  return (
    <Stack gap="sm" role="group" aria-label={TIMELINE_PANEL_TEXT.setDuration}>
      <Box ref={focusFirstField}>
      <Flex gap="xs" align="center">
        <NumberInput
          size="sm"
          sizeToContent
          min={MIN_DURATION_MS}
          max={MAX_DURATION_MS}
          step={DURATION_STEP}
          value={ms}
          aria-label={TIMELINE_PANEL_TEXT.durationCaption}
          onChange={setMs}
          onKeyDown={(event) => {
            if (event.key === 'Enter') done(setDuration(ms));
          }}
        />
        <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.durationUnit}</Text>
        <Button size="sm" variant="primary" onClick={() => done(setDuration(ms))}>{TIMELINE_PANEL_TEXT.apply}</Button>
      </Flex>
      </Box>
      <Flex gap="xs" align="center" wrap role="group" aria-label={TIMELINE_PANEL_TEXT.presets}>
        {DURATION_CHOICES.map((choice) => (
          <Button key={choice} size="sm" variant="secondary" onClick={() => done(setDuration(choice))}>{`${choice} ms`}</Button>
        ))}
      </Flex>
      <Flex gap="xs" align="center" wrap role="group" aria-label={TIMELINE_PANEL_TEXT.sameFps}>
        <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.sameFps}</Text>
        <NumberInput size="sm" sizeToContent min={1} max={120} step={1} value={fps} aria-label={TIMELINE_PANEL_TEXT.sameFps} onChange={setFps} />
        <Toggle size="sm" label={TIMELINE_PANEL_TEXT.wholeAnimation} checked={whole} onChange={setWhole} />
        <Button size="sm" variant="secondary" onClick={() => done(setSameFps(fps, whole))}>{TIMELINE_PANEL_TEXT.apply}</Button>
      </Flex>
      <Flex gap="xs" align="center" wrap role="group" aria-label={TIMELINE_PANEL_TEXT.scaleBy}>
        <Text variant="caption" tone="muted">{TIMELINE_PANEL_TEXT.scaleBy}</Text>
        {SCALE_CHOICES.map((choice) => (
          <Button key={choice} size="sm" variant="secondary" onClick={() => done(scaleDurations(choice))}>{`x${choice}`}</Button>
        ))}
        <NumberInput size="sm" sizeToContent min={0.1} max={10} step={0.1} value={factor} aria-label={TIMELINE_PANEL_TEXT.scaleCustom} onChange={setFactor} />
        <Button size="sm" variant="secondary" onClick={() => done(scaleDurations(factor))}>{TIMELINE_PANEL_TEXT.apply}</Button>
      </Flex>
    </Stack>
  );
};

export { DurationPopover };
