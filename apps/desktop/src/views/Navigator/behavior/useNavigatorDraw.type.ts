/* @layer renderer-app @kind types */
import type { RefObject } from 'react';

interface NavigatorParts {
  canvas: RefObject<HTMLCanvasElement | null>;
  frame: RefObject<HTMLElement | null>;
  mark: RefObject<HTMLElement | null>;
}

export type { NavigatorParts };
