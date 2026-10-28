/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';

const useKeepCurrentVisible = (area: RefObject<HTMLElement | null>, current: string, layoutKey: number): void => {
  useEffect(() => {
    const element = area.current?.querySelector<HTMLElement>(`[data-frame-id="${current}"]`);
    element?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [area, current, layoutKey]);
};

export { useKeepCurrentVisible };
