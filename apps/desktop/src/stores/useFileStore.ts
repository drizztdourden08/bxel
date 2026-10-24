/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { movedPath } from '../files/moved-path';
import type { FileState } from './file-store.type';

const useFileStore = create<FileState>()((set) => ({
  paths: {},
  recovered: {},
  busy: null,
  remember: (documentId, path) => set((state) => ({ paths: { ...state.paths, [documentId]: path } })),
  retarget: (from, to) =>
    set((state) => ({
      paths: Object.fromEntries(
        Object.entries(state.paths).flatMap(([id, path]) => {
          const next = movedPath(path, from, to);
          return next === null ? [] : [[id, next]];
        }),
      ),
    })),
  markRecovered: (documentId) => set((state) => ({ recovered: { ...state.recovered, [documentId]: true } })),
  clearRecovered: (documentId) =>
    set((state) => {
      if (!(documentId in state.recovered)) return state;
      return { recovered: Object.fromEntries(Object.entries(state.recovered).filter(([id]) => id !== documentId)) };
    }),
  setBusy: (busy) => set({ busy }),
}));

export { useFileStore };
