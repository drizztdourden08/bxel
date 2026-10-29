/* @layer renderer-app @kind component */
import { ControlMenuRow, ControlMenuSub, NumberInput, Slider } from '@drizztdourden08/tessera';
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
import { OnionChoiceRow } from './OnionChoiceRow';
import { OnionToggleRow } from './OnionToggleRow';

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
      <OnionChoiceRow field="falloff" label={ONION_TEXT.falloff} order={ONION_FALLOFF_ORDER} names={ONION_TEXT.falloffs} />
      <OnionChoiceRow field="tint" label={ONION_TEXT.tint} order={ONION_TINT_ORDER} names={ONION_TEXT.tints} />
      <OnionChoiceRow field="style" label={ONION_TEXT.style} order={ONION_STYLE_ORDER} names={ONION_TEXT.styles} />
      <ControlMenuSub label={ONION_TEXT.more}>
        <OnionChoiceRow field="order" label={ONION_TEXT.order} order={ONION_ORDER_ORDER} names={ONION_TEXT.orders} />
        <OnionToggleRow field="wrap" label={ONION_TEXT.wrap} />
        <OnionChoiceRow field="scope" label={ONION_TEXT.scope} order={ONION_SCOPE_ORDER} names={ONION_TEXT.scopes} />
        <OnionToggleRow field="skipRepeats" label={ONION_TEXT.skipRepeats} />
        <OnionChoiceRow field="position" label={ONION_TEXT.position} order={ONION_POSITION_ORDER} names={ONION_TEXT.positions} />
        <OnionToggleRow field="hideWhilePlaying" label={ONION_TEXT.hide} />
      </ControlMenuSub>
    </>
  );
};

export { OnionPanel };
