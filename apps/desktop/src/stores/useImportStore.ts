/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ImportState } from './import-store.type';

const useImportStore = create<ImportState>()((set) => ({
  image: null,
  tiled: null,
  show: (image, tiled) => set({ image, tiled: tiled ?? null }),
  hide: () => set({ image: null, tiled: null }),
}));

export { useImportStore };
