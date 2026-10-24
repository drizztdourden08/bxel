/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { SPRITE_DEFAULTS } from './sprite-store.constants';
import type { SpriteState } from './sprite-store.type';
import { useDocumentStore } from './useDocumentStore';

const useSpriteStore = create<SpriteState>()((set) => ({
  ...SPRITE_DEFAULTS,
  reset: () => set(SPRITE_DEFAULTS),
  setMode: (mode, isolated = false) => set({ mode, isolated, sliceDraw: false }),
  setActive: (activeId) => set({ activeId }),
  setSelection: (selected, anchor) => set({ selected, anchor, broadcast: false, gap: null }),
  setBroadcast: (broadcast) => set({ broadcast, gap: null }),
  setSpritesScope: (spritesScope) => set({ spritesScope }),
  setLayerScope: (layerScope) => set({ layerScope }),
  setFrameScope: (frameScope) => set({ frameScope }),
  setGap: (gap) => set({ gap }),
  setSliceDraw: (sliceDraw) => set({ sliceDraw }),
  setRenaming: (renamingId) => set({ renamingId }),
}));

useDocumentStore.subscribe((state, previous) => {
  if (state.activeId !== previous.activeId) useSpriteStore.getState().reset();
});

export { useSpriteStore };
