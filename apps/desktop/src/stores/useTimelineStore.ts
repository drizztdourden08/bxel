/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { TIMELINE_DEFAULTS } from './timeline-store.constants';
import type { TimelineState } from './timeline-store.type';
import { useDocumentStore } from './useDocumentStore';
import { useWorkspaceStore } from './useWorkspaceStore';

const useTimelineStore = create<TimelineState>()((set) => ({
  ...TIMELINE_DEFAULTS,
  reset: () => set((state) => ({ ...TIMELINE_DEFAULTS, loop: state.loop, onion: state.onion })),
  setFrame: (frameId) => set({ frameId, selection: { frames: frameId === null ? [] : [frameId], anchor: frameId }, cursor: -1 }),
  select: (selection, frameId) => set({ selection, frameId, cursor: -1 }),
  selectTag: (tagId) => set({ tagId, cursor: -1 }),
  play: () => set({ playing: true, cursor: -1 }),
  pause: () => set({ playing: false }),
  togglePlay: () => set((state) => ({ playing: !state.playing, cursor: -1 })),
  setLoop: (loop) => set({ loop }),
  setCursor: (cursor) => set({ cursor }),
  setOnion: (patch) => set((state) => ({ onion: { ...state.onion, ...patch } })),
  setPivotDraft: (pivotDraft) => set({ pivotDraft }),
}));

const resetOnChange = (next: string | null, previous: string | null): void => {
  if (next !== previous) useTimelineStore.getState().reset();
};

useDocumentStore.subscribe((state, previous) => resetOnChange(state.activeId, previous.activeId));
useWorkspaceStore.subscribe((state, previous) => resetOnChange(state.activeTab, previous.activeTab));

export { useTimelineStore };
