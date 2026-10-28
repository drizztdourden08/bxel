/* @layer renderer-app @kind component */
import { ControlMenuRow, ControlMenuSub, NumberInput, SegmentedControl, Slider, Toggle } from '@drizztdourden08/tessera';
import { ONION_LIMITS } from '../../../stores/timeline-store.constants';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import {
  ONION_FALLOFF_ORDER,
  ONION_ORDER_ORDER,
  ONION_POSITION_ORDER,
  ONION_SCOPE_ORDER,
  ONION_STYLE_ORDER,
  ONION_TEXT,
  ONION_TINT_ORDER,
} from '../../../timeline/onion.constants';

const clampFrames = (value: number): number => Math.min(Math.max(Math.round(value) || 0, ONION_LIMITS.frames.min), ONION_LIMITS.frames.max);

const OnionPanel = () => {
  const onion = useTimelineStore((state) => state.onion);
  const setOnion = useTimelineStore((state) => state.setOnion);
  const { frames, opacity } = ONION_LIMITS;
  return (
    <>
      <ControlMenuRow label={ONION_TEXT.before}>
        <NumberInput size="sm" buttons="sides" sizeToContent min={frames.min} max={frames.max} step={1} value={onion.before} aria-label={ONION_TEXT.before} onChange={(value) => setOnion({ before: clampFrames(value) })} />
      </ControlMenuRow>
      <ControlMenuRow label={ONION_TEXT.after}>
        <NumberInput size="sm" buttons="sides" sizeToContent min={frames.min} max={frames.max} step={1} value={onion.after} aria-label={ONION_TEXT.after} onChange={(value) => setOnion({ after: clampFrames(value) })} />
      </ControlMenuRow>
      <ControlMenuRow label={ONION_TEXT.opacity}>
        <Slider size="sm" min={opacity.min} max={opacity.max} step={5} value={onion.opacity} aria-label={ONION_TEXT.opacity} onChange={(next) => setOnion({ opacity: next })} />
      </ControlMenuRow>
      <ControlMenuRow label={ONION_TEXT.falloff}>
        <SegmentedControl size="sm" aria-label={ONION_TEXT.falloff} value={onion.falloff} options={ONION_FALLOFF_ORDER.map((value) => ({ value, label: ONION_TEXT.falloffs[value] }))} onChange={(falloff) => setOnion({ falloff })} />
      </ControlMenuRow>
      <ControlMenuRow label={ONION_TEXT.tint}>
        <SegmentedControl size="sm" aria-label={ONION_TEXT.tint} value={onion.tint} options={ONION_TINT_ORDER.map((value) => ({ value, label: ONION_TEXT.tints[value] }))} onChange={(tint) => setOnion({ tint })} />
      </ControlMenuRow>
      <ControlMenuRow label={ONION_TEXT.style}>
        <SegmentedControl size="sm" aria-label={ONION_TEXT.style} value={onion.style} options={ONION_STYLE_ORDER.map((value) => ({ value, label: ONION_TEXT.styles[value] }))} onChange={(style) => setOnion({ style })} />
      </ControlMenuRow>
      <ControlMenuSub label={ONION_TEXT.more}>
        <ControlMenuRow label={ONION_TEXT.order}>
          <SegmentedControl size="sm" aria-label={ONION_TEXT.order} value={onion.order} options={ONION_ORDER_ORDER.map((value) => ({ value, label: ONION_TEXT.orders[value] }))} onChange={(order) => setOnion({ order })} />
        </ControlMenuRow>
        <ControlMenuRow label={ONION_TEXT.wrap}>
          <Toggle size="sm" aria-label={ONION_TEXT.wrap} checked={onion.wrap} onChange={(wrap) => setOnion({ wrap })} />
        </ControlMenuRow>
        <ControlMenuRow label={ONION_TEXT.scope}>
          <SegmentedControl size="sm" aria-label={ONION_TEXT.scope} value={onion.scope} options={ONION_SCOPE_ORDER.map((value) => ({ value, label: ONION_TEXT.scopes[value] }))} onChange={(scope) => setOnion({ scope })} />
        </ControlMenuRow>
        <ControlMenuRow label={ONION_TEXT.skipRepeats}>
          <Toggle size="sm" aria-label={ONION_TEXT.skipRepeats} checked={onion.skipRepeats} onChange={(skipRepeats) => setOnion({ skipRepeats })} />
        </ControlMenuRow>
        <ControlMenuRow label={ONION_TEXT.position}>
          <SegmentedControl size="sm" aria-label={ONION_TEXT.position} value={onion.position} options={ONION_POSITION_ORDER.map((value) => ({ value, label: ONION_TEXT.positions[value] }))} onChange={(position) => setOnion({ position })} />
        </ControlMenuRow>
        <ControlMenuRow label={ONION_TEXT.hide}>
          <Toggle size="sm" aria-label={ONION_TEXT.hide} checked={onion.hideWhilePlaying} onChange={(hideWhilePlaying) => setOnion({ hideWhilePlaying })} />
        </ControlMenuRow>
      </ControlMenuSub>
    </>
  );
};

export { OnionPanel };
