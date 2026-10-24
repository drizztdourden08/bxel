/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { TIMELINE_DEFAULTS } from './timeline-store.constants';
import type { TimelineState } from './timeline-store.type';
import { useDocumentStore } from './useDocumentStore';
import { useSpriteStore } from './useSpriteStore';

const useTimelineStore = create<TimelineState>()((set) => ({
  ...TIMELINE_DEFAULTS,
  reset: () => set(TIMELINE_DEFAULTS),
  setFrame: (frameId) => set({ frameId, cursor: -1 }),
  select: (selection, frameId) => set({ selection, frameId, cursor: -1 }),
  selectTag: (tagId) => set({ tagId }),
  play: () => set({ playing: true, cursor: -1 }),
  pause: () => set({ playing: false }),
  togglePlay: () => set((state) => ({ playing: !state.playing, cursor: -1 })),
  setLoop: (loop) => set({ loop }),
  setPingPong: (pingPong) => set({ pingPong, cursor: -1 }),
  setCursor: (cursor) => set({ cursor }),
  setZone: (zone) => set({ zone }),
  setOnion: (patch) => set((state) => ({ onion: { ...state.onion, ...patch } })),
}));

const resetOnChange = (next: string | null, previous: string | null): void => {
  if (next !== previous) useTimelineStore.getState().reset();
};

useDocumentStore.subscribe((state, previous) => resetOnChange(state.activeId, previous.activeId));
useSpriteStore.subscribe((state, previous) => resetOnChange(state.activeId, previous.activeId));

export { useTimelineStore };
