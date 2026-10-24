/* @layer renderer-app @kind types */
import type { FrameId, LayerId, TagId } from '@bxel/document';

type OnionTint = 'none' | 'split' | 'grey';

interface OnionSettings {
  on: boolean;
  before: number;
  after: number;
  opacity: number;
  tint: OnionTint;
}

interface CelKey {
  layerId: LayerId;
  frameId: FrameId;
}

interface TimelineSelection {
  frames: readonly FrameId[];
  layers: readonly LayerId[];
  anchor: CelKey | null;
}

interface TimelineSettings {
  frameId: FrameId | null;
  selection: TimelineSelection;
  tagId: TagId | null;
  playing: boolean;
  loop: boolean;
  pingPong: boolean;
  cursor: number;
  onion: OnionSettings;
}

interface TimelineState extends TimelineSettings {
  reset: () => void;
  setFrame: (frameId: FrameId | null) => void;
  select: (selection: TimelineSelection, frameId: FrameId | null) => void;
  selectTag: (tagId: TagId | null) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setLoop: (loop: boolean) => void;
  setPingPong: (pingPong: boolean) => void;
  setCursor: (cursor: number) => void;
  setOnion: (patch: Partial<OnionSettings>) => void;
}

export type { CelKey, OnionSettings, OnionTint, TimelineSelection, TimelineSettings, TimelineState };
