/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { TIMELINE_DEFAULTS } from './timeline-store.constants';
import type { TimelineState } from './timeline-store.type';
import { useDocumentStore } from './useDocumentStore';
import { useWorkspaceStore } from './useWorkspaceStore';

const useTimelineStore = create<TimelineState>()((set) => ({
  ...TIMELINE_DEFAULTS,
  reset: () =>
    set((state) => ({
      ...TIMELINE_DEFAULTS,
      onion: state.onion,
      playMode: state.playMode,
      subtags: state.subtags,
      rewind: state.rewind,
      speed: state.speed,
      compact: state.compact,
      zoom: state.zoom,
      timeMode: state.timeMode,
      units: state.units,
      groupByFacing: state.groupByFacing,
    })),
  setFrame: (frameId) => set({ frameId, selection: { frames: frameId === null ? [] : [frameId], anchor: frameId }, cursor: -1 }),
  setPlayhead: (frameId) => set({ frameId, cursor: -1 }),
  select: (selection, frameId) => set({ selection, frameId, cursor: -1 }),
  selectTag: (tagId) => set({ tagId, rangePicked: false, loopRange: null, cursor: -1, colourPicker: false }),
  setRangePicked: () => set({ tagId: null, rangePicked: true, loopRange: null, cursor: -1 }),
  setLoopRange: (loopRange) => set({ loopRange, cursor: -1 }),
  play: () => set((state) => ({ playing: true, cursor: -1, playStart: state.frameId })),
  playOnceNow: () => set((state) => ({ playing: true, playOnce: true, cursor: -1, playStart: state.frameId })),
  pause: () => set({ playing: false, playOnce: false }),
  togglePlay: () => set((state) => ({ playing: !state.playing, playOnce: false, cursor: -1, playStart: state.playing ? state.playStart : state.frameId })),
  setPlayMode: (playMode) => set({ playMode }),
  setSubtags: (subtags) => set({ subtags }),
  setRewind: (rewind) => set({ rewind }),
  setSpeed: (speed) => set({ speed }),
  setCursor: (cursor) => set({ cursor }),
  setOnion: (patch) => set((state) => ({ onion: { ...state.onion, ...patch } })),
  setCompact: (compact) => set({ compact }),
  setZoom: (zoom) => set({ zoom, fit: false }),
  setFit: (fit) => set({ fit }),
  setTimeMode: (timeMode) => set({ timeMode }),
  setUnits: (units) => set({ units }),
  setGroupByFacing: (groupByFacing) => set({ groupByFacing }),
  setPivotDraft: (pivotDraft) => set({ pivotDraft }),
  setColourPicker: (colourPicker) => set({ colourPicker }),
  setPopover: (popover) => set({ popover }),
}));

const resetOnChange = (next: string | null, previous: string | null): void => {
  if (next !== previous) useTimelineStore.getState().reset();
};

useDocumentStore.subscribe((state, previous) => resetOnChange(state.activeId, previous.activeId));
useWorkspaceStore.subscribe((state, previous) => resetOnChange(state.activeTab, previous.activeTab));

export { useTimelineStore };
