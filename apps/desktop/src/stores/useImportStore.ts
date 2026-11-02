/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ImportState } from './import-store.type';

const useImportStore = create<ImportState>()((set) => ({
  image: null,
  tiled: null,
  kind: null,
  show: (image, tiled, kind) => set({ image, tiled: tiled ?? null, kind: kind ?? null }),
  hide: () => set({ image: null, tiled: null, kind: null }),
}));

export { useImportStore };
