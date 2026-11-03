/* @layer renderer-app @kind types */
import type { RefObject } from 'react';

interface ParentBoundary {
  marker: RefObject<HTMLElement | null>;
  boundary: RefObject<HTMLElement | null>;
}

export type { ParentBoundary };
