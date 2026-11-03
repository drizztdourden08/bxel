/* @layer renderer-app @kind constants */
import { ONION_DEFAULTS as ONION_STATE_DEFAULTS } from '@bxel/mcp';
import type { OnionSettings, PlaySettings, TimelineSelection, TimelineSettings, ViewSettings } from './timeline-store.type';

const NO_SELECTION: TimelineSelection = { frames: [], anchor: null };

const ONION_DEFAULTS: OnionSettings = ONION_STATE_DEFAULTS;

const ONION_LIMITS = {
  frames: { min: 0, max: 8 },
  opacity: { min: 5, max: 80 },
} as const;

const PLAY_DEFAULTS: PlaySettings = { playMode: 'loop', subtags: false, rewind: true, speed: 1 };

const SPEEDS: readonly number[] = [0.25, 0.5, 1, 1.5, 2];

const THUMB_SIZES: readonly number[] = [24, 32, 48, 64, 96];

const DEFAULT_THUMB = 32;

const FIT_LIMITS = { min: 16, max: 96 } as const;

const VIEW_DEFAULTS: ViewSettings = { compact: false, zoom: DEFAULT_THUMB, timeMode: false, units: 'ms', groupByFacing: false };

const TIMELINE_DEFAULTS: TimelineSettings = {
  frameId: null,
  selection: NO_SELECTION,
  tagId: null,
  rangePicked: false,
  loopRange: null,
  playing: false,
  playOnce: false,
  cursor: -1,
  playStart: null,
  fit: false,
  onion: ONION_DEFAULTS,
  pivotDraft: null,
  colourPicker: false,
  popover: null,
  ...PLAY_DEFAULTS,
  ...VIEW_DEFAULTS,
};

export { DEFAULT_THUMB, FIT_LIMITS, ONION_DEFAULTS, ONION_LIMITS, PLAY_DEFAULTS, SPEEDS, THUMB_SIZES, TIMELINE_DEFAULTS, VIEW_DEFAULTS };
