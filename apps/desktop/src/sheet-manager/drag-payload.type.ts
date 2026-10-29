/* @layer renderer-app @kind types */
type DragSource = 'sheet' | 'library' | 'project' | 'outside';

interface DragEntry {
  kind: 'sprite' | 'animation';
  assetId: string;
  path: string;
  tagId?: string | null;
}

interface DragState {
  source: DragSource;
  entries: readonly DragEntry[];
}

type DropSide = 'before' | 'after';

interface DropTarget {
  key: string | null;
  side: DropSide;
}

export type { DragEntry, DragSource, DragState, DropSide, DropTarget };
