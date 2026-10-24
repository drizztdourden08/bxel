/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { AreaState } from './area-store.type';

const useAreaStore = create<AreaState>()((set, get) => ({
  highlight: null,
  toggle: (area) => set({ highlight: get().highlight?.key === area.key ? null : area }),
  sync: (areas) => {
    const current = get().highlight;
    if (current === null) return;
    const next = areas.find((area) => area.key === current.key) ?? null;
    if (next !== current) set({ highlight: next });
  },
  clear: () => set({ highlight: null }),
}));

export { useAreaStore };
