/* @layer renderer-app @kind types */
import type { PointerEvent } from 'react';

interface NavigatorPointer {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
}

export type { NavigatorPointer };
