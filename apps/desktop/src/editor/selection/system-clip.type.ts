/* @layer renderer-app @kind types */
import type { Clip } from './selection.type';

interface SystemClip {
  clip: Clip;
  changed: boolean;
}

export type { SystemClip };
