/* @layer renderer-app @kind types */
import type { FocusEventHandler } from 'react';

interface CursorRelease {
  onPointerPixel: () => void;
  onBlur: FocusEventHandler<HTMLElement>;
}

export type { CursorRelease };
