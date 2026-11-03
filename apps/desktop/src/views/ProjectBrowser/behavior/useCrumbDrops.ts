/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useRef, useState } from 'react';
import { bindCrumbDrop } from './bind-crumb-drop';
import { useBrowserContext } from './useBrowserContext';
import type { CrumbDrops } from './useCrumbDrops.type';

const useCrumbDrops = (): CrumbDrops => {
  const { actions, model } = useBrowserContext();
  const [overId, setOverId] = useState<string | null>(null);
  const latest = useRef({ actions, model });
  const bound = useRef(new Map<string, () => void>());
  useEffect(() => {
    latest.current = { actions, model };
  });
  const read = useCallback(() => latest.current, []);
  const onSegmentRef = useCallback((id: string, element: HTMLElement | null): void => {
    bound.current.get(id)?.();
    bound.current.delete(id);
    if (element === null) return;
    bound.current.set(id, bindCrumbDrop(element, id, { read, setOverId }));
  }, [read]);
  return { overId, onSegmentRef };
};

export { useCrumbDrops };
