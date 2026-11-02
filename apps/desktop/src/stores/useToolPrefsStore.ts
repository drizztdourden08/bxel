/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { TOOL_PREFS_DEFAULTS } from './tool-prefs-store.constants';
import type { ToolPrefsState } from './tool-prefs-store.type';

const useToolPrefsStore = create<ToolPrefsState>()((set) => ({
  ...TOOL_PREFS_DEFAULTS,
  patch: (change) => set(change),
  toggleHidden: (memberId) =>
    set((state) => ({
      hiddenMembers: state.hiddenMembers.includes(memberId) ? state.hiddenMembers.filter((each) => each !== memberId) : [...state.hiddenMembers, memberId],
    })),
  resetLayout: () => set({ hiddenMembers: [], optionTiers: {}, layouts: {} }),
  placeSlots: (surface, layout) => set((state) => ({ layouts: { ...state.layouts, [surface]: layout } })),
  resetSurface: (surface, memberIds) =>
    set((state) => {
      const { [surface]: _dropped, ...rest } = state.layouts;
      return { layouts: rest, hiddenMembers: state.hiddenMembers.filter((each) => !memberIds.includes(each)) };
    }),
  setOptionTier: (optionId, tier) =>
    set((state) => {
      const { [optionId]: _dropped, ...rest } = state.optionTiers;
      return { optionTiers: tier === null ? rest : { ...rest, [optionId]: tier } };
    }),
}));

export { useToolPrefsStore };
