/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { AssetViewState } from './asset-view-store.type';

const useAssetViewStore = create<AssetViewState>()((set) => ({
  views: {},
  patch: (key, patch) => set((state) => ({ views: { ...state.views, [key]: { ...state.views[key], ...patch } } })),
  reset: (key) =>
    set((state) => {
      const { [key]: dropped, ...rest } = state.views;
      return dropped === undefined ? state : { views: rest };
    }),
}));

export { useAssetViewStore };
