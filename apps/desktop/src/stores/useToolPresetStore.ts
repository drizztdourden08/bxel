/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { moveItem } from '../editor/presets/move-item';
import type { ToolPresetState } from './tool-preset-store.type';

const useToolPresetStore = create<ToolPresetState>()((set) => ({
  user: [],
  draft: null,
  load: (user) => set({ user }),
  save: (preset) =>
    set((state) => ({
      user: state.user.some((each) => each.id === preset.id)
        ? state.user.map((each) => (each.id === preset.id ? preset : each))
        : [...state.user, preset],
    })),
  remove: (id) => set((state) => ({ user: state.user.filter((each) => each.id !== id) })),
  rename: (id, name) => set((state) => ({ user: state.user.map((each) => (each.id === id ? { ...each, name } : each)) })),
  move: (id, delta) => set((state) => ({ user: moveItem(state.user, id, delta) })),
  openDraft: (draft) => set({ draft }),
}));

export { useToolPresetStore };
