/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { TILESET_VIEW_DEFAULTS } from './tileset-view-store.constants';
import type { TilesetViewState } from './tileset-view-store.type';
import { sameChoice } from './same-choice';
import { useDocumentStore } from './useDocumentStore';

const useTilesetViewStore = create<TilesetViewState>()((set) => ({
  ...TILESET_VIEW_DEFAULTS,
  setMode: (mode) => set({ mode, shapeIndex: 0, pointIndex: null }),
  setSearch: (search) => set({ search }),
  toggleFilter: (filter) =>
    set((state) => ({ filters: state.filters.includes(filter) ? state.filters.filter((each) => each !== filter) : [...state.filters, filter] })),
  toggleChoice: (choice) =>
    set((state) => ({
      choices: state.choices.some((each) => sameChoice(each, choice)) ? state.choices.filter((each) => !sameChoice(each, choice)) : [...state.choices, choice],
    })),
  clearFilters: () => set({ filters: [], choices: [], search: '' }),
  setZoom: (zoom) => set({ zoom }),
  setShowKeys: (showKeys) => set({ showKeys }),
  setShowUses: (showUses) => set({ showUses }),
  setCollisionPaint: (collisionPaint) => set({ collisionPaint }),
  setCollisionLayer: (collisionLayer) => set({ collisionLayer }),
  setDataPaint: (dataPaint) => set({ dataPaint }),
  setInspectorCollapsed: (inspectorCollapsed) => set({ inspectorCollapsed }),
  setShapeIndex: (shapeIndex) => set({ shapeIndex, pointIndex: null }),
  setShapeSnap: (shapeSnap) => set({ shapeSnap }),
  setPointIndex: (pointIndex) => set({ pointIndex }),
  setLastShape: (lastShape) => set({ lastShape }),
  setShapeClipboard: (shapeClipboard) => set({ shapeClipboard }),
  setTerrainSetId: (terrainSetId) => set({ terrainSetId, terrainSlot: null, markDrafts: {} }),
  setTerrainSlot: (terrainSlot) => set({ terrainSlot }),
  setHoverKey: (hoverKey) => set((state) => (state.hoverKey === hoverKey ? state : { hoverKey })),
  setMarkDraft: (key, mask) =>
    set((state) => {
      const { [key]: _gone, ...rest } = state.markDrafts;
      return { markDrafts: mask === null ? rest : { ...rest, [key]: mask } };
    }),
}));

useDocumentStore.subscribe((state, previous) => {
  if (state.activeId !== previous.activeId) {
    useTilesetViewStore.setState({ search: '', filters: [], choices: [], dataPaint: null, shapeIndex: 0, pointIndex: null, terrainSetId: null, terrainSlot: null, markDrafts: {}, hoverKey: null });
  }
});

export { useTilesetViewStore };
