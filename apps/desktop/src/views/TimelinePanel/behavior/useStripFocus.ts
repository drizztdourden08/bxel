/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';

const useStripFocus = (strip: RefObject<HTMLElement | null>, current: string): void => {
  useEffect(() => {
    const root = strip.current;
    if (!root?.contains(root.ownerDocument.activeElement)) return;
    root.querySelector<HTMLElement>('[aria-current="true"]')?.focus();
  }, [strip, current]);
};

export { useStripFocus };
