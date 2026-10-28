/* @layer renderer-app @kind types */
import type { OnionSettings } from '../../../stores/timeline-store.type';

type OnionChoiceKey = 'falloff' | 'tint' | 'style' | 'order' | 'scope' | 'position';

interface OnionChoiceRowProps<K extends OnionChoiceKey> {
  field: K;
  label: string;
  order: readonly OnionSettings[K][];
  names: Readonly<Record<OnionSettings[K], string>>;
}

type OnionToggleKey = 'wrap' | 'skipRepeats' | 'hideWhilePlaying';

interface OnionToggleRowProps {
  field: OnionToggleKey;
  label: string;
}

export type { OnionChoiceKey, OnionChoiceRowProps, OnionToggleRowProps };
