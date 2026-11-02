/* @layer renderer-app @kind types */
import type { ViewStep } from './view-steps.type';

type SpritesPatch = NonNullable<Parameters<ViewStep>[0]['sprites']>;

export type { SpritesPatch };
