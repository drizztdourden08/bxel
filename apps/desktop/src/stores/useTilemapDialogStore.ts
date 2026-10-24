/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { TilemapDialogState } from './tilemap-dialog-store.type';

const useTilemapDialogStore = create<TilemapDialogState>()((set) => ({
  kind: null,
  tileKey: null,
  show: (kind, tileKey) => set({ kind, tileKey: tileKey ?? null }),
  hide: () => set({ kind: null, tileKey: null }),
}));

export { useTilemapDialogStore };
