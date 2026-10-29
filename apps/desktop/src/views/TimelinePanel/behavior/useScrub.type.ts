/* @layer renderer-app @kind types */
import type { KeyboardEvent, PointerEvent } from 'react';

interface Scrub {
  onPointerDown: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  loop: { from: number; to: number } | null;
}

export type { Scrub };
