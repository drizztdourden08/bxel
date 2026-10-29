/* @layer renderer-app @kind types */
import type { OnionFalloff, OnionOrder, OnionPosition, OnionScope, OnionStyle, OnionTint, PlayMode } from '../stores/timeline-store.type';

interface AnimationSettings {
  animOnionOn: boolean;
  animOnionBefore: number;
  animOnionAfter: number;
  animOnionOpacity: number;
  animOnionFalloff: OnionFalloff;
  animOnionTint: OnionTint;
  animOnionBeforeColour: string;
  animOnionAfterColour: string;
  animOnionStyle: OnionStyle;
  animOnionOrder: OnionOrder;
  animOnionWrap: boolean;
  animOnionScope: OnionScope;
  animOnionSkipRepeats: boolean;
  animOnionPosition: OnionPosition;
  animOnionHideWhilePlaying: boolean;
  animPlayMode: PlayMode;
  animSubtags: boolean;
  animRewind: boolean;
  animSpeed: number;
  animThumb: number;
}

export type { AnimationSettings };
