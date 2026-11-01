/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { SkillometerState } from './skillometer-store.type';

const useSkillometerStore = create<SkillometerState>()((set, get) => ({
  picks: {},
  told: [],
  count: (tool) => {
    const next = (get().picks[tool] ?? 0) + 1;
    set((state) => ({ picks: { ...state.picks, [tool]: next } }));
    return next;
  },
  markTold: (tool) => set((state) => ({ told: [...state.told, tool] })),
  reset: () => set({ picks: {}, told: [] }),
}));

export { useSkillometerStore };
