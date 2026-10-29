/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { TILEMAP_DEFAULTS } from './tilemap-store.constants';
import type { TilemapState } from './tilemap-store.type';
import { useDocumentStore } from './useDocumentStore';

const useTilemapStore = create<TilemapState>()((set, get) => ({
  ...TILEMAP_DEFAULTS,
  reset: () => {
    const { animateTiles, clip, selectVariant, selectMode } = get();
    set({ ...TILEMAP_DEFAULTS, animateTiles, clip, selectVariant, selectMode });
  },
  setTileset: (tilesetId) => set({ tilesetId }),
  setMap: (mapId) => set({ mapId, layerId: null, selection: null, paste: null }),
  setLayer: (layerId) => set({ layerId, selection: null, paste: null }),
  placeTiles: () => set({ editMode: 'place', editKey: null, editSpriteId: null }),
  editTile: (editKey, editSpriteId) => set({ editMode: 'edit', editKey, editSpriteId }),
  setStamp: (stamp) => set({ stamp }),
  setFlags: (flags) => set({ flags }),
  setFilled: (filled) => set({ filled }),
  setSelection: (selection) => set({ selection }),
  setSelectVariant: (selectVariant) => set({ selectVariant }),
  setSelectMode: (selectMode) => set({ selectMode }),
  setClip: (clip) => set({ clip }),
  setPaste: (paste) => set({ paste }),
  setShowCollision: (showCollision) => set({ showCollision }),
  setTerrainBrush: (terrainBrush) => set({ terrainBrush }),
  setAnimateTiles: (animateTiles) => set({ animateTiles }),
}));

useDocumentStore.subscribe((state, previous) => {
  if (state.activeId !== previous.activeId) useTilemapStore.getState().reset();
});

export { useTilemapStore };
