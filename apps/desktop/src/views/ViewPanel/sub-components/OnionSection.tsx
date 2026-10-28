/* @layer renderer-app @kind component */
import { Flex, NumberInput, SegmentedControl, Slider, Span, Text, Toggle } from '@drizztdourden08/tessera';
import { ONION_LIMITS } from '../../../stores/timeline-store.constants';
import type { OnionTint } from '../../../stores/timeline-store.type';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { ONION_TEXT, ONION_TINTS } from '../ViewPanel.constants';

const tintOption = (tint: OnionTint) => ({
  value: tint,
  label: (
    <Flex as="span" gap="2xs" align="center">
      {ONION_TINTS[tint].swatches.map((colour) => (
        <Span key={colour} className={`view-panel__dot view-panel__dot--${colour}`} aria-hidden="true" />
      ))}
      <Text as="span" variant="caption">{ONION_TINTS[tint].label}</Text>
    </Flex>
  ),
});

const OnionSection = () => {
  const onion = useTimelineStore((state) => state.onion);
  const setOnion = useTimelineStore((state) => state.setOnion);
  const frames = (value: number): number => Math.min(ONION_LIMITS.frames.max, Math.max(ONION_LIMITS.frames.min, Math.round(value)));
  return (
    <Flex direction="column" gap="sm">
      <Toggle size="sm" label={ONION_TEXT.show} checked={onion.on} onChange={(on) => setOnion({ on })} />
      <Flex gap="sm" align="center" wrap>
        <Flex gap="xs" align="center">
          <Text as="span" variant="caption" tone="muted">{ONION_TEXT.before}</Text>
          <NumberInput size="sm" aria-label={ONION_TEXT.before} min={ONION_LIMITS.frames.min} max={ONION_LIMITS.frames.max} value={onion.before} onChange={(value) => setOnion({ before: frames(value) })} />
        </Flex>
        <Flex gap="xs" align="center">
          <Text as="span" variant="caption" tone="muted">{ONION_TEXT.after}</Text>
          <NumberInput size="sm" aria-label={ONION_TEXT.after} min={ONION_LIMITS.frames.min} max={ONION_LIMITS.frames.max} value={onion.after} onChange={(value) => setOnion({ after: frames(value) })} />
        </Flex>
      </Flex>
      <Slider
        size="sm"
        label={ONION_TEXT.opacity}
        min={ONION_LIMITS.opacity.min}
        max={ONION_LIMITS.opacity.max}
        step={1}
        keyStep={5}
        formatValue={(value) => `${value}%`}
        value={onion.opacity}
        onChange={(opacity) => setOnion({ opacity })}
      />
      <SegmentedControl
        size="sm"
        label={ONION_TEXT.tint}
        value={onion.tint}
        options={(['none', 'split', 'grey'] as const).map(tintOption)}
        onChange={(tint) => setOnion({ tint })}
      />
    </Flex>
  );
};

export { OnionSection };
