/* @layer renderer-app @kind types */
import type { DragEvent } from 'react';

interface LibraryDrop {
  over: boolean;
  bind: {
    onDragOver: (event: DragEvent<HTMLElement>) => void;
    onDragLeave: () => void;
    onDrop: (event: DragEvent<HTMLElement>) => void;
  };
}

export type { LibraryDrop };
