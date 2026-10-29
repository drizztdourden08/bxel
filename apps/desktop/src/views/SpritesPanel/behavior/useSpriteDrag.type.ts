/* @layer renderer-app @kind types */
import type { DropSide, EntryDragSpec } from '../../../sheet-manager/drag-payload.type';

interface EntryDrag {
  dragFor: (key: string) => EntryDragSpec;
  marks: ReadonlyMap<string, DropSide>;
  setMark: (mark: { key: string; side: DropSide } | null) => void;
}

export type { EntryDrag };
