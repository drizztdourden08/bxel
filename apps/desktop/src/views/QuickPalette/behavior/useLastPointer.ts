/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { notePointer } from '../../../editor/quick-palette/pointer-point';

const useLastPointer = (): void => {
  useEffect(() => {
    const move = (event: PointerEvent): void => notePointer({ x: event.clientX, y: event.clientY });
    window.addEventListener('pointermove', move, { capture: true, passive: true });
    return () => window.removeEventListener('pointermove', move, { capture: true });
  }, []);
};

export { useLastPointer };
