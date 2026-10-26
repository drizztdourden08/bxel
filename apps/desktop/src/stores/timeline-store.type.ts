/* @layer renderer-app @kind types */
import type { AnimFrameId, Pivot2, TagId } from '@bxel/document';

type OnionTint = 'none' | 'split' | 'grey';

interface OnionSettings {
  on: boolean;
  before: number;
  after: number;
  opacity: number;
  tint: OnionTint;
}

interface TimelineSelection {
  frames: readonly AnimFrameId[];
  anchor: AnimFrameId | null;
}

interface TimelineSettings {
  frameId: AnimFrameId | null;
  selection: TimelineSelection;
  tagId: TagId | null;
  playing: boolean;
  loop: boolean;
  cursor: number;
  onion: OnionSettings;
  pivotDraft: Pivot2 | null;
}

interface TimelineState extends TimelineSettings {
  reset: () => void;
  setFrame: (frameId: AnimFrameId | null) => void;
  select: (selection: TimelineSelection, frameId: AnimFrameId | null) => void;
  selectTag: (tagId: TagId | null) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setLoop: (loop: boolean) => void;
  setCursor: (cursor: number) => void;
  setOnion: (patch: Partial<OnionSettings>) => void;
  setPivotDraft: (pivotDraft: Pivot2 | null) => void;
}

export type { OnionSettings, OnionTint, TimelineSelection, TimelineSettings, TimelineState };
