/* @layer renderer-app @kind component */
import { Flex, NumberInput, SegmentedControl, Slider } from '@drizztdourden08/tessera';
import { ONION_LIMITS } from '../../../stores/timeline-store.constants';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { ONION_TEXT, ONION_TINT_ORDER } from '../../../timeline/onion.constants';

const OnionControls = () => {
  const onion = useTimelineStore((state) => state.onion);
  const setOnion = useTimelineStore((state) => state.setOnion);
  const { frames, opacity } = ONION_LIMITS;
  return (
    <Flex gap="md" align="center" wrap role="group" aria-label={ONION_TEXT.toggle}>
      <NumberInput
        size="sm"
        sizeToContent
        min={frames.min}
        max={frames.max}
        step={1}
        value={onion.before}
        disabled={!onion.on}
        aria-label={ONION_TEXT.before}
        onChange={(before) => setOnion({ before: Math.min(Math.max(Math.round(before) || 0, frames.min), frames.max) })}
      />
      <NumberInput
        size="sm"
        sizeToContent
        min={frames.min}
        max={frames.max}
        step={1}
        value={onion.after}
        disabled={!onion.on}
        aria-label={ONION_TEXT.after}
        onChange={(after) => setOnion({ after: Math.min(Math.max(Math.round(after) || 0, frames.min), frames.max) })}
      />
      <Slider
        min={opacity.min}
        max={opacity.max}
        step={5}
        value={onion.opacity}
        disabled={!onion.on}
        aria-label={ONION_TEXT.opacity}
        onChange={(next) => setOnion({ opacity: next })}
      />
      <SegmentedControl
        size="sm"
        aria-label={ONION_TEXT.tint}
        disabled={!onion.on}
        value={onion.tint}
        options={ONION_TINT_ORDER.map((tint) => ({ value: tint, label: ONION_TEXT.tints[tint] }))}
        onChange={(tint) => setOnion({ tint })}
      />
    </Flex>
  );
};

export { OnionControls };
