/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';

const useKeepCurrentVisible = (area: RefObject<HTMLElement | null>, current: string, layoutKey: number): void => {
  useEffect(() => {
    const root = area.current;
    const element = root?.querySelector<HTMLElement>(`[data-frame-id="${current}"]`);
    if (!root || !element) return;
    const box = element.getBoundingClientRect();
    const view = root.getBoundingClientRect();
    if (box.left < view.left) root.scrollLeft -= view.left - box.left;
    else if (box.right > view.right) root.scrollLeft += box.right - view.right;
  }, [area, current, layoutKey]);
};

export { useKeepCurrentVisible };
