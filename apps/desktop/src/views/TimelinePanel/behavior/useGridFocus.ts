/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { useTimelineStore } from '../../../stores/useTimelineStore';

const useGridFocus = (gridRef: RefObject<HTMLElement | null>, currentKey: string): void => {
  useEffect(() => {
    const grid = gridRef.current;
    const active = grid?.ownerDocument.activeElement;
    if (!grid || !active || !grid.contains(active) || useTimelineStore.getState().playing) return;
    grid.querySelector<HTMLElement>('[data-cel-current="yes"]')?.focus();
  }, [gridRef, currentKey]);
};

export { useGridFocus };
