/* @layer renderer-app @kind types */
import type { DragEvent } from 'react';

interface RowDrag {
  draggable?: boolean;
  onDragStart?: (event: DragEvent<HTMLElement>) => void;
}

export type { RowDrag };
