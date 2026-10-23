/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { FileState } from './file-store.type';

const useFileStore = create<FileState>()((set) => ({
  paths: {},
  busy: null,
  remember: (documentId, path) => set((state) => ({ paths: { ...state.paths, [documentId]: path } })),
  setBusy: (busy) => set({ busy }),
}));

export { useFileStore };
