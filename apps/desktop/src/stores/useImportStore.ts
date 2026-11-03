/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ImportState } from './import-store.type';

const useImportStore = create<ImportState>()((set) => ({
  image: null,
  tiled: null,
  kind: null,
  sheetId: null,
  show: (image, tiled, kind, sheetId) => set({ image, tiled: tiled ?? null, kind: kind ?? null, sheetId: sheetId ?? null }),
  hide: () => set({ image: null, tiled: null, kind: null, sheetId: null }),
}));

export { useImportStore };
