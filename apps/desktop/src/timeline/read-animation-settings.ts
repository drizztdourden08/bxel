/* @layer renderer-app @kind logic */
import { FIT_LIMITS, ONION_LIMITS, SPEEDS } from '../stores/timeline-store.constants';
import type { OnionSettings, PlaySettings, ViewSettings } from '../stores/timeline-store.type';
import { ANIMATION_DEFAULTS } from './animation-settings.constants';
import type { AnimationSettings } from './animation-settings.type';
import { ONION_FALLOFF_ORDER, ONION_ORDER_ORDER, ONION_POSITION_ORDER, ONION_SCOPE_ORDER, ONION_STYLE_ORDER, ONION_TINT_ORDER } from './onion.constants';

type Stored = Partial<Record<keyof AnimationSettings, unknown>>;

const whole = (value: unknown, min: number, max: number, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback;

const flag = (value: unknown, fallback: boolean): boolean => (typeof value === 'boolean' ? value : fallback);

const oneOf = <T extends string>(value: unknown, allowed: readonly T[], fallback: T): T => (allowed.find((each) => each === value) ?? fallback);

const hex = (value: unknown, fallback: string): string => (typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback);

const readOnion = (stored: Stored): OnionSettings => {
  const d = ANIMATION_DEFAULTS;
  const { frames, opacity } = ONION_LIMITS;
  return {
    on: flag(stored.animOnionOn, d.animOnionOn),
    before: whole(stored.animOnionBefore, frames.min, frames.max, d.animOnionBefore),
    after: whole(stored.animOnionAfter, frames.min, frames.max, d.animOnionAfter),
    opacity: whole(stored.animOnionOpacity, opacity.min, opacity.max, d.animOnionOpacity),
    falloff: oneOf(stored.animOnionFalloff, ONION_FALLOFF_ORDER, d.animOnionFalloff),
    tint: oneOf(stored.animOnionTint, ONION_TINT_ORDER, d.animOnionTint),
    beforeColour: hex(stored.animOnionBeforeColour, d.animOnionBeforeColour),
    afterColour: hex(stored.animOnionAfterColour, d.animOnionAfterColour),
    style: oneOf(stored.animOnionStyle, ONION_STYLE_ORDER, d.animOnionStyle),
    order: oneOf(stored.animOnionOrder, ONION_ORDER_ORDER, d.animOnionOrder),
    wrap: flag(stored.animOnionWrap, d.animOnionWrap),
    scope: oneOf(stored.animOnionScope, ONION_SCOPE_ORDER, d.animOnionScope),
    skipRepeats: flag(stored.animOnionSkipRepeats, d.animOnionSkipRepeats),
    position: oneOf(stored.animOnionPosition, ONION_POSITION_ORDER, d.animOnionPosition),
    hideWhilePlaying: flag(stored.animOnionHideWhilePlaying, d.animOnionHideWhilePlaying),
  };
};

const readPlay = (stored: Stored): PlaySettings => {
  const speed = typeof stored.animSpeed === 'number' && SPEEDS.includes(stored.animSpeed) ? stored.animSpeed : ANIMATION_DEFAULTS.animSpeed;
  return {
    playMode: oneOf(stored.animPlayMode, ['loop', 'once', 'pingpong'], ANIMATION_DEFAULTS.animPlayMode),
    subtags: flag(stored.animSubtags, ANIMATION_DEFAULTS.animSubtags),
    rewind: flag(stored.animRewind, ANIMATION_DEFAULTS.animRewind),
    speed,
  };
};

const readView = (stored: Stored): ViewSettings => ({
  zoom: whole(stored.animThumb, FIT_LIMITS.min, FIT_LIMITS.max, ANIMATION_DEFAULTS.animThumb),
  timeMode: flag(stored.animTimeMode, ANIMATION_DEFAULTS.animTimeMode),
  units: oneOf(stored.animUnits, ['ms', 'seconds', 'ticks'], ANIMATION_DEFAULTS.animUnits),
});

const readThumbs = (stored: Stored): Record<string, number> => {
  const raw = stored.animThumbs;
  if (typeof raw !== 'object' || raw === null) return {};
  return Object.fromEntries(Object.entries(raw).flatMap(([key, value]) => (typeof value === 'number' ? [[key, whole(value, FIT_LIMITS.min, FIT_LIMITS.max, ANIMATION_DEFAULTS.animThumb)]] : [])));
};

export { readOnion, readPlay, readThumbs, readView };
export type { Stored };
