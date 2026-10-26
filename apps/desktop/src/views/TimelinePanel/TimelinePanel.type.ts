/* @layer renderer-app @kind types */
import type { AnimSpanTag } from '@bxel/document';
import type { ReorderDrag } from '@drizztdourden08/tessera';
import type { PixelIconName } from '../../icons/pixel-icon.type';
import type { AnimationFocus, FrameCell, TagCell, TimelineModel } from '../../timeline/timeline.type';

interface TimelineAction {
  id: string;
  label: string;
  shortcut: string | null;
  icon: PixelIconName;
  run: () => unknown;
}

interface TimelineKeyInfo {
  key: string;
  shiftKey: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}

type TimelineKeyAction =
  | { kind: 'step'; delta: number; extend: boolean }
  | { kind: 'edge'; end: 'first' | 'last'; extend: boolean }
  | { kind: 'move'; delta: number };

interface FocusProps {
  focus: AnimationFocus;
}

interface FrameStripProps extends FocusProps {
  model: TimelineModel;
}

interface FrameCellViewProps extends FocusProps {
  cell: FrameCell;
  index: number;
  total: number;
  drag: ReorderDrag;
}

interface FrameThumbProps extends FocusProps {
  cell: FrameCell;
}

interface TagLaneProps {
  cells: readonly (TagCell | null)[];
}

interface TagEditorProps {
  tag: AnimSpanTag;
  readOnly: boolean;
}

interface ActionBarProps {
  label: string;
  actions: readonly TimelineAction[];
  disabled: boolean;
}

interface NumberFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onCommit: (value: number) => boolean;
}

export type {
  ActionBarProps,
  FocusProps,
  FrameCellViewProps,
  FrameStripProps,
  FrameThumbProps,
  NumberFieldProps,
  TagEditorProps,
  TagLaneProps,
  TimelineAction,
  TimelineKeyAction,
  TimelineKeyInfo,
};
