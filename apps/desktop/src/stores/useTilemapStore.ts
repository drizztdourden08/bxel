/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { TILEMAP_DEFAULTS } from './tilemap-store.constants';
import type { TilemapState } from './tilemap-store.type';
import { useDocumentStore } from './useDocumentStore';

const useTilemapStore = create<TilemapState>()((set, get) => ({
  ...TILEMAP_DEFAULTS,
  reset: () => set({ ...TILEMAP_DEFAULTS, animateTiles: get().animateTiles }),
  setTileset: (tilesetId) => set({ tilesetId }),
  setMap: (mapId) => set({ mapId, layerId: null, selection: null }),
  setLayer: (layerId) => set({ layerId, selection: null }),
  placeTiles: () => set({ editMode: 'place', editKey: null, editSpriteId: null }),
  editTile: (editKey, editSpriteId) => set({ editMode: 'edit', editKey, editSpriteId }),
  setStamp: (stamp) => set({ stamp }),
  setFlags: (flags) => set({ flags }),
  setFilled: (filled) => set({ filled }),
  setSelection: (selection) => set({ selection }),
  setShowCollision: (showCollision) => set({ showCollision }),
  setTerrainBrush: (terrainBrush) => set({ terrainBrush }),
  setAnimateTiles: (animateTiles) => set({ animateTiles }),
}));

useDocumentStore.subscribe((state, previous) => {
  if (state.activeId !== previous.activeId) useTilemapStore.getState().reset();
});

export { useTilemapStore };
