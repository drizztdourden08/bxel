/* @layer renderer-app @kind types */
import type { AnimFrameId, AnimSpanTag, TagId } from '@bxel/document';
import type { ReorderDrag } from '@drizztdourden08/tessera';
import type { RefObject } from 'react';
import type { PixelIconName } from '../../icons/pixel-icon.type';
import type { AnimationFocus, FrameCell, TagBar, TimelineModel } from '../../timeline/timeline.type';
import type { DurationDraft } from '../../timeline/duration-draft.type';
import type { TrackLayout } from '../../timeline/track-layout.type';
import type { TagDrag } from './behavior/useTagDrag.type';

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

interface CompactProps extends FocusProps {
  compact: boolean;
}

interface FooterProps extends FocusProps {
  short: boolean;
}

interface TimelineViewProps extends FocusProps {
  model: TimelineModel;
}

interface BodyProps extends TimelineViewProps {
  width: number;
}

interface LayoutProps extends FocusProps {
  layout: TrackLayout;
  thumb: number;
}

interface DraftProps extends LayoutProps {
  onDraft: (draft: DurationDraft | null) => void;
}

interface TrackProps extends DraftProps {
  model: TimelineModel;
  scroller: RefObject<HTMLElement | null>;
}

interface LanesProps extends LayoutProps {
  model: TimelineModel;
}

interface RulerProps extends LayoutProps {
  model: TimelineModel;
}

interface FrameOptionProps extends DraftProps {
  cell: FrameCell;
  index: number;
  total: number;
  drag: ReorderDrag;
  mode: 'move' | 'copy' | 'link';
}

interface FrameThumbProps extends FocusProps {
  cell: FrameCell;
  thumb: number;
}

interface TagBarViewProps extends LayoutProps {
  bar: TagBar;
  roving: boolean;
  readOnly: boolean;
  drag: TagDrag;
}

interface TagEditorProps {
  tagId: TagId;
  readOnly: boolean;
}

interface TagPartProps {
  tag: AnimSpanTag;
  readOnly: boolean;
}

interface TagPopoverProps extends FocusProps {
  container: RefObject<HTMLElement | null>;
}

interface FramePopoverProps extends FocusProps {
  container: RefObject<HTMLElement | null>;
}

interface DurationChipProps {
  id: AnimFrameId;
  durationMs: number;
  readOnly: boolean;
}

interface DurationEdgeProps {
  id: AnimFrameId;
  durationMs: number;
  pxPerMs: number;
  onDraft: (draft: DurationDraft | null) => void;
}

interface OnionHandlesProps extends FocusProps {
  layout: TrackLayout;
  current: number;
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
  mixed?: boolean;
  presets?: readonly number[];
  suffix?: string;
  onCommit: (value: number) => boolean;
}

interface AxisField {
  label: string;
  value: number;
  mixed?: boolean;
  onCommit: (value: number) => boolean;
}

interface AxisFieldsProps {
  caption: string;
  frameId: string;
  x: AxisField;
  y: AxisField;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
}

export type {
  ActionBarProps,
  AxisFieldsProps,
  BodyProps,
  CompactProps,
  DurationChipProps,
  DurationEdgeProps,
  FocusProps,
  FooterProps,
  FrameOptionProps,
  FramePopoverProps,
  FrameThumbProps,
  LanesProps,
  NumberFieldProps,
  OnionHandlesProps,
  RulerProps,
  TagBarViewProps,
  TagEditorProps,
  TagPartProps,
  TagPopoverProps,
  TimelineAction,
  TimelineKeyAction,
  TimelineKeyInfo,
  TrackProps,
};
