/* @layer renderer-app @kind hook */
import { useCallback, useEffect, useRef } from 'react';
import { DRAG_SPRING_MS } from '../../../asset-drag/asset-drag.constants';
import type { DropSpring } from '../ProjectPanel.type';

const useDropSpring = (open: (key: string) => void): DropSpring => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const armed = useRef<string | null>(null);

  const stop = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    armed.current = null;
  }, []);
  const start = useCallback(
    (key: string) => {
      if (armed.current === key) return;
      stop();
      armed.current = key;
      timer.current = setTimeout(() => open(key), DRAG_SPRING_MS);
    },
    [open, stop],
  );
  useEffect(() => stop, [stop]);
  return { start, stop };
};

export { useDropSpring };
