/* @layer renderer-app @kind types */
import type { IconName } from '@drizztdourden08/tessera';

type PixelIconName = Extract<IconName, `pixel-${string}`>;

export type { PixelIconName };
