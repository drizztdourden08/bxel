/* @layer renderer-app @kind types */
import type { AnimationSettings } from './animation-settings.type';

type Stored = Partial<Record<keyof AnimationSettings, unknown>>;

export type { Stored };
