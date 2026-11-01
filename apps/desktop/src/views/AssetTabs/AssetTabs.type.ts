/* @layer renderer-app @kind types */
import type { DragEvent } from 'react';

type TabStripDrop = { readonly onDragOver: (event: DragEvent) => void; readonly onDrop: (event: DragEvent) => void };

export type { TabStripDrop };
