/* @layer renderer-app @kind types */
import type { AnimationSettings } from './animation-settings.type';

type Persisted = Omit<AnimationSettings, 'animThumbs' | 'animThumb'>;

export type { Persisted };
