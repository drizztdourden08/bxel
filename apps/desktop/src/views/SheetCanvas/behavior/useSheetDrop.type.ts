/* @layer renderer-app @kind types */
import type { DragEvent } from 'react';

interface SheetDropBind {
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
}

export type { SheetDropBind };
