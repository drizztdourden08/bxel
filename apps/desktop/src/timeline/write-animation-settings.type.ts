/* @layer renderer-app @kind types */
import type { AnimationSettings } from './animation-settings.type';

type Persisted = Omit<AnimationSettings, 'animThumb'>;

export type { Persisted };
