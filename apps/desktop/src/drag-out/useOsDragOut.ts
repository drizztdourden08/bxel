/* @layer renderer-app @kind hook */
import type { DragEvent, PointerEvent, RefObject } from 'react';
import { useCallback, useRef } from 'react';
import { dragOutPaths } from './drag-out-paths';
import type { OsDragOut, OsDragOutInput } from './useOsDragOut.type';

const useOsDragOut = (ref: RefObject<HTMLElement | null>, { paths, disabled }: OsDragOutInput): OsDragOut => {
  const armed = useRef(false);
  const release = useCallback((): void => {
    armed.current = false;
    if (ref.current) ref.current.draggable = false;
  }, [ref]);
  const arm = useCallback(
    (event: PointerEvent<HTMLElement>): void => {
      armed.current = event.altKey && event.button === 0 && !disabled && paths().length > 0;
      if (ref.current) ref.current.draggable = armed.current;
    },
    [ref, paths, disabled],
  );
  const start = useCallback(
    (event: DragEvent<HTMLElement>): void => {
      event.preventDefault();
      if (armed.current) void dragOutPaths(paths());
      release();
    },
    [paths, release],
  );
  const holding = useCallback((): boolean => armed.current, []);
  return { holding, handlers: { onPointerDownCapture: arm, onPointerUp: release, onDragStart: start, onDragEnd: release } };
};

export { useOsDragOut };
