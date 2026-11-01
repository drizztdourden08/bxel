/* @layer renderer-app @kind logic */
import type { DragEvent } from 'react';

const hasFileDrag = (event: DragEvent): boolean => event.dataTransfer.types.includes('Files');

export { hasFileDrag };
