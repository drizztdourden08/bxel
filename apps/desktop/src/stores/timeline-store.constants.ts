/* @layer renderer-app @kind constants */
import type { OnionSettings, TimelineSelection, TimelineSettings } from './timeline-store.type';

const NO_SELECTION: TimelineSelection = { frames: [], anchor: null };

const ONION_DEFAULTS: OnionSettings = { on: false, before: 1, after: 1, opacity: 40, tint: 'split' };

const ONION_LIMITS = {
  frames: { min: 0, max: 4 },
  opacity: { min: 5, max: 80 },
} as const;

const TIMELINE_DEFAULTS: TimelineSettings = {
  frameId: null,
  selection: NO_SELECTION,
  tagId: null,
  playing: false,
  loop: true,
  cursor: -1,
  onion: ONION_DEFAULTS,
  pivotDraft: null,
};

export { NO_SELECTION, ONION_DEFAULTS, ONION_LIMITS, TIMELINE_DEFAULTS };
