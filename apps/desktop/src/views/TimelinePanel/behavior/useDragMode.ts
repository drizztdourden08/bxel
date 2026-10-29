/* @layer renderer-app @kind hook */
import { useEffect, useRef, useState } from 'react';
import type { DragMode } from '../../../timeline/drag-mode.type';
import type { DragModeState } from './useDragMode.type';

const modeOf = (event: { ctrlKey: boolean; metaKey: boolean; altKey: boolean }): DragMode => {
  if (event.altKey) return 'link';
  return event.ctrlKey || event.metaKey ? 'copy' : 'move';
};

const useDragMode = (active: boolean): DragModeState => {
  const [mode, setMode] = useState<DragMode>('move');
  const last = useRef<DragMode>('move');
  useEffect(() => {
    if (!active) return undefined;
    const track = (event: KeyboardEvent | PointerEvent): void => {
      const next = modeOf(event);
      last.current = next;
      setMode(next);
    };
    window.addEventListener('pointermove', track, true);
    window.addEventListener('pointerup', track, true);
    window.addEventListener('keydown', track, true);
    window.addEventListener('keyup', track, true);
    return () => {
      window.removeEventListener('pointermove', track, true);
      window.removeEventListener('pointerup', track, true);
      window.removeEventListener('keydown', track, true);
      window.removeEventListener('keyup', track, true);
    };
  }, [active]);
  return { mode, last };
};

export { useDragMode };
