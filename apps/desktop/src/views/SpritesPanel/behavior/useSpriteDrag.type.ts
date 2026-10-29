/* @layer renderer-app @kind types */
import type { DropSide } from '../../../sheet-manager/drag-payload.type';
import type { SpriteDragHandlers } from '../SpritesPanel.type';

interface EntryDrag {
  dragFor: (key: string) => SpriteDragHandlers;
  marks: ReadonlyMap<string, DropSide>;
  zone: Pick<SpriteDragHandlers, 'onDragOver' | 'onDrop' | 'onDragLeave'>;
}

export type { EntryDrag };
