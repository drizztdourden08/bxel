/* @layer renderer-app @kind types */
import type { AnimFrameId, Pivot2, TagId } from '@bxel/document';

type OnionTint = 'none' | 'split' | 'grey';

type OnionFalloff = 'linear' | 'flat';

type OnionStyle = 'filled' | 'outline';

type OnionOrder = 'play' | 'strip';

type OnionScope = 'range' | 'all';

type OnionPosition = 'behind' | 'front';

interface OnionSettings {
  on: boolean;
  before: number;
  after: number;
  opacity: number;
  falloff: OnionFalloff;
  tint: OnionTint;
  beforeColour: string;
  afterColour: string;
  style: OnionStyle;
  order: OnionOrder;
  wrap: boolean;
  scope: OnionScope;
  skipRepeats: boolean;
  position: OnionPosition;
  hideWhilePlaying: boolean;
}

type PlayMode = 'loop' | 'once' | 'pingpong';

type TimeUnits = 'ms' | 'seconds' | 'ticks';

interface TimelineSelection {
  frames: readonly AnimFrameId[];
  anchor: AnimFrameId | null;
}

interface LoopRange {
  from: AnimFrameId;
  to: AnimFrameId;
}

type TimelinePopover = { kind: 'tag'; tagId: TagId } | { kind: 'duration' } | { kind: 'position' };

interface PlaySettings {
  playMode: PlayMode;
  subtags: boolean;
  rewind: boolean;
  speed: number;
}

interface ViewSettings {
  compact: boolean;
  zoom: number;
  timeMode: boolean;
  units: TimeUnits;
  groupByFacing: boolean;
}

interface TimelineSettings extends PlaySettings, ViewSettings {
  frameId: AnimFrameId | null;
  selection: TimelineSelection;
  tagId: TagId | null;
  rangePicked: boolean;
  loopRange: LoopRange | null;
  playing: boolean;
  playOnce: boolean;
  cursor: number;
  playStart: AnimFrameId | null;
  fit: boolean;
  onion: OnionSettings;
  pivotDraft: Pivot2 | null;
  colourPicker: boolean;
  popover: TimelinePopover | null;
}

interface TimelineState extends TimelineSettings {
  reset: () => void;
  setFrame: (frameId: AnimFrameId | null) => void;
  setPlayhead: (frameId: AnimFrameId) => void;
  select: (selection: TimelineSelection, frameId: AnimFrameId | null) => void;
  selectTag: (tagId: TagId | null) => void;
  setRangePicked: () => void;
  setLoopRange: (loopRange: LoopRange | null) => void;
  play: () => void;
  playOnceNow: () => void;
  pause: () => void;
  togglePlay: () => void;
  setPlayMode: (playMode: PlayMode) => void;
  setSubtags: (subtags: boolean) => void;
  setRewind: (rewind: boolean) => void;
  setSpeed: (speed: number) => void;
  setCursor: (cursor: number) => void;
  setOnion: (patch: Partial<OnionSettings>) => void;
  setCompact: (compact: boolean) => void;
  setZoom: (zoom: number) => void;
  setFit: (fit: boolean) => void;
  setTimeMode: (timeMode: boolean) => void;
  setUnits: (units: TimeUnits) => void;
  setGroupByFacing: (groupByFacing: boolean) => void;
  setPivotDraft: (pivotDraft: Pivot2 | null) => void;
  setColourPicker: (colourPicker: boolean) => void;
  setPopover: (popover: TimelinePopover | null) => void;
}

export type {
  LoopRange,
  OnionFalloff,
  OnionOrder,
  OnionPosition,
  OnionScope,
  OnionSettings,
  OnionStyle,
  OnionTint,
  PlayMode,
  PlaySettings,
  TimeUnits,
  TimelineSelection,
  TimelineSettings,
  TimelineState,
  ViewSettings,
};
