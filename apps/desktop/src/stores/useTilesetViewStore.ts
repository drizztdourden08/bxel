/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { TILESET_VIEW_DEFAULTS } from './tileset-view-store.constants';
import type { TilesetViewState } from './tileset-view-store.type';
import { useDocumentStore } from './useDocumentStore';

const useTilesetViewStore = create<TilesetViewState>()((set) => ({
  ...TILESET_VIEW_DEFAULTS,
  setMode: (mode) => set({ mode, shapeIndex: 0 }),
  setSearch: (search) => set({ search }),
  toggleFilter: (filter) =>
    set((state) => ({ filters: state.filters.includes(filter) ? state.filters.filter((each) => each !== filter) : [...state.filters, filter] })),
  clearFilters: () => set({ filters: [], search: '' }),
  setZoom: (zoom) => set({ zoom }),
  setShowKeys: (showKeys) => set({ showKeys }),
  setShowUses: (showUses) => set({ showUses }),
  setCollisionPaint: (collisionPaint) => set({ collisionPaint }),
  setCollisionLayer: (collisionLayer) => set({ collisionLayer }),
  setDataPaint: (dataPaint) => set({ dataPaint }),
  setInspectorCollapsed: (inspectorCollapsed) => set({ inspectorCollapsed }),
  setShapeIndex: (shapeIndex) => set({ shapeIndex }),
  setLastShape: (lastShape) => set({ lastShape }),
  setShapeClipboard: (shapeClipboard) => set({ shapeClipboard }),
}));

useDocumentStore.subscribe((state, previous) => {
  if (state.activeId !== previous.activeId) {
    useTilesetViewStore.setState({ search: '', filters: [], dataPaint: null, shapeIndex: 0 });
  }
});

export { useTilesetViewStore };
