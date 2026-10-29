/* @layer renderer-app @kind types */
import type { OnionSettings } from '../../../stores/timeline-store.type';

type OnionChoiceField = 'falloff' | 'tint' | 'style' | 'order' | 'scope' | 'position';

type OnionCheckField = 'wrap' | 'skipRepeats' | 'hideWhilePlaying';

type OnionSetter = (patch: Partial<OnionSettings>) => void;

interface OnionChoiceSpec<K extends OnionChoiceField> {
  field: K;
  label: string;
  order: readonly OnionSettings[K][];
  names: Readonly<Record<OnionSettings[K], string>>;
}

export type { OnionCheckField, OnionChoiceField, OnionChoiceSpec, OnionSetter };
