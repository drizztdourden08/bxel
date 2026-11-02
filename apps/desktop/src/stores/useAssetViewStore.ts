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
      const references = dropped.references ?? [];
      return { views: references.length === 0 ? rest : { ...rest, [key]: { references } } };
    }),
}));

export { useAssetViewStore };
