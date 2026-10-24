/* @layer renderer-app @kind types */
import type { FrameId, Tag } from '@bxel/document';
import type { ReorderDrag } from '@drizztdourden08/tessera';
import type { PixelIconName } from '../../icons/pixel-icon.type';
import type { CelCell, CelMove, FrameColumn, LayerRow, TagCell, TimelineModel } from '../../timeline/timeline.type';

interface TimelineAction {
  id: string;
  label: string;
  shortcut: string | null;
  icon: PixelIconName;
  run: () => unknown;
}

type TimelineKeyAction =
  | { kind: 'play' }
  | { kind: 'cursor'; by: CelMove; extend: boolean }
  | { kind: 'edge'; end: 'first' | 'last' }
  | { kind: 'moveFrames'; delta: number }
  | { kind: 'moveCels'; by: CelMove }
  | { kind: 'clear' };

interface TimelineKeyInfo {
  key: string;
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

interface TimelineGridProps {
  model: TimelineModel;
  frameId: FrameId;
}

interface FrameHeaderProps {
  column: FrameColumn;
  index: number;
  total: number;
  drag: ReorderDrag;
}

interface TagLaneProps {
  cells: readonly (TagCell | null)[];
}

interface LayerRowViewProps {
  row: LayerRow;
  frameId: FrameId;
}

interface CelButtonProps {
  cell: CelCell;
}

interface DurationFieldProps {
  value: number;
  onCommit: (durationMs: number) => boolean;
}

interface TagEditorProps {
  tag: Tag;
}

interface ActionBarProps {
  label: string;
  actions: readonly TimelineAction[];
}

export type {
  ActionBarProps,
  CelButtonProps,
  DurationFieldProps,
  FrameHeaderProps,
  LayerRowViewProps,
  TagEditorProps,
  TagLaneProps,
  TimelineAction,
  TimelineGridProps,
  TimelineKeyAction,
  TimelineKeyInfo,
};
