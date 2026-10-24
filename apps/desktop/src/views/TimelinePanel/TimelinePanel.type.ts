/* @layer renderer-app @kind types */
import type { DragEvent } from 'react';
import type { FrameId, Tag } from '@bxel/document';
import type { ReorderDrag } from '@drizztdourden08/tessera';
import type { CelKey, TimelineZone } from '../../stores/timeline-store.type';
import type { PixelIconName } from '../../icons/pixel-icon.type';
import type { CelCell, CelMove, FrameColumn, LayerRow, TagCell, TimelineModel } from '../../timeline/timeline.type';

interface CelDragHandlers {
  draggable: boolean;
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
}

interface CelDrag {
  over: string | null;
  handlers: (key: CelKey, draggable: boolean) => CelDragHandlers;
}

interface TimelineAction {
  id: string;
  label: string;
  shortcut: string | null;
  icon: PixelIconName;
  run: () => unknown;
}

type CelKeyAction =
  | { kind: 'play' }
  | { kind: 'cursor'; by: CelMove; extend: boolean }
  | { kind: 'edge'; end: 'first' | 'last' }
  | { kind: 'moveFrames'; delta: number }
  | { kind: 'moveCels'; by: CelMove };

type LaneKeyAction =
  | { kind: 'park'; by: CelMove }
  | { kind: 'addPick' }
  | { kind: 'frame'; delta: number; extend: boolean }
  | { kind: 'zone'; zone: TimelineZone }
  | { kind: 'tag'; delta: number };

type TimelineKeyAction = CelKeyAction | LaneKeyAction;

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
  drag: CelDrag;
}

interface CelButtonProps {
  cell: CelCell;
  drag: CelDrag;
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
  CelDrag,
  CelDragHandlers,
  CelKeyAction,
  DurationFieldProps,
  FrameHeaderProps,
  LaneKeyAction,
  LayerRowViewProps,
  TagEditorProps,
  TagLaneProps,
  TimelineAction,
  TimelineGridProps,
  TimelineKeyAction,
  TimelineKeyInfo,
};
