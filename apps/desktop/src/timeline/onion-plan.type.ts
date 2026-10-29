/* @layer renderer-app @kind types */
import type { OnionSettings, PlayMode } from '../stores/timeline-store.type';
import type { OnionStep } from './onion.type';

interface Ring {
  steps: readonly OnionStep[];
  at: number;
  wrap: boolean;
}

interface OnionPlanOptions {
  onion: OnionSettings;
  mode: PlayMode;
}

export type { OnionPlanOptions, Ring };
