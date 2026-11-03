/* @layer renderer-app @kind hook */
import { useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import type { ParentBoundary } from './useParentBoundary.type';

const useParentBoundary = (): ParentBoundary => {
  const marker = useRef<HTMLElement | null>(null);
  const boundary = useMemo<RefObject<HTMLElement | null>>(() => ({ get current() { return marker.current?.parentElement ?? null; } }), []);
  return { marker, boundary };
};

export { useParentBoundary };
