/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ImportState } from './import-store.type';

const useImportStore = create<ImportState>()((set) => ({
  image: null,
  show: (image) => set({ image }),
  hide: () => set({ image: null }),
}));

export { useImportStore };
