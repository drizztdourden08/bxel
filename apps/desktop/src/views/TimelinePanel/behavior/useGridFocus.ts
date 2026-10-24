/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import type { TimelineZone } from '../../../stores/timeline-store.type';
import { useTimelineStore } from '../../../stores/useTimelineStore';
import { ZONE_ATTRIBUTE } from '../TimelinePanel.constants';

const useGridFocus = (gridRef: RefObject<HTMLElement | null>, currentKey: string, zone: TimelineZone): void => {
  useEffect(() => {
    const grid = gridRef.current;
    const active = grid?.ownerDocument.activeElement;
    if (!grid || !active || !grid.contains(active) || useTimelineStore.getState().playing) return;
    grid.querySelector<HTMLElement>(`[${ZONE_ATTRIBUTE}="${zone}"][data-roving="yes"]`)?.focus();
  }, [gridRef, currentKey, zone]);
};

export { useGridFocus };
