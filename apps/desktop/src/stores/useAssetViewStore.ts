/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { AssetViewState } from './asset-view-store.type';

const useAssetViewStore = create<AssetViewState>()((set) => ({
  views: {},
  patch: (key, patch) => set((state) => ({ views: { ...state.views, [key]: { ...state.views[key], ...patch } } })),
  reset: (key) =>
    set((state) => {
      const { [key]: dropped, ...rest } = state.views;
      if (dropped === undefined) return state;
      const { references = [], guideColours = {} } = dropped;
      const kept = { ...(references.length > 0 ? { references } : {}), ...(Object.keys(guideColours).length > 0 ? { guideColours } : {}) };
      return { views: Object.keys(kept).length === 0 ? rest : { ...rest, [key]: kept } };
    }),
}));

export { useAssetViewStore };
