/* @layer renderer-app @kind logic */
import { ONION_LIMITS } from '../stores/timeline-store.constants';
import type { OnionSettings } from '../stores/timeline-store.type';
import { ANIMATION_DEFAULTS } from './animation-settings.constants';
import { ONION_FALLOFF_ORDER, ONION_ORDER_ORDER, ONION_POSITION_ORDER, ONION_SCOPE_ORDER, ONION_STYLE_ORDER, ONION_TINT_ORDER } from './onion.constants';
import type { Stored } from './read-animation-settings.type';
import { readFlag } from './read-flag';
import { readHex } from './read-hex';
import { readOneOf } from './read-one-of';
import { readWhole } from './read-whole';

const readOnion = (stored: Stored): OnionSettings => {
  const d = ANIMATION_DEFAULTS;
  const { frames, opacity } = ONION_LIMITS;
  return {
    on: readFlag(stored.animOnionOn, d.animOnionOn),
    before: readWhole(stored.animOnionBefore, frames.min, frames.max, d.animOnionBefore),
    after: readWhole(stored.animOnionAfter, frames.min, frames.max, d.animOnionAfter),
    opacity: readWhole(stored.animOnionOpacity, opacity.min, opacity.max, d.animOnionOpacity),
    falloff: readOneOf(stored.animOnionFalloff, ONION_FALLOFF_ORDER, d.animOnionFalloff),
    tint: readOneOf(stored.animOnionTint, ONION_TINT_ORDER, d.animOnionTint),
    beforeColour: readHex(stored.animOnionBeforeColour, d.animOnionBeforeColour),
    afterColour: readHex(stored.animOnionAfterColour, d.animOnionAfterColour),
    style: readOneOf(stored.animOnionStyle, ONION_STYLE_ORDER, d.animOnionStyle),
    order: readOneOf(stored.animOnionOrder, ONION_ORDER_ORDER, d.animOnionOrder),
    wrap: readFlag(stored.animOnionWrap, d.animOnionWrap),
    scope: readOneOf(stored.animOnionScope, ONION_SCOPE_ORDER, d.animOnionScope),
    skipRepeats: readFlag(stored.animOnionSkipRepeats, d.animOnionSkipRepeats),
    position: readOneOf(stored.animOnionPosition, ONION_POSITION_ORDER, d.animOnionPosition),
    hideWhilePlaying: readFlag(stored.animOnionHideWhilePlaying, d.animOnionHideWhilePlaying),
  };
};

export { readOnion };
