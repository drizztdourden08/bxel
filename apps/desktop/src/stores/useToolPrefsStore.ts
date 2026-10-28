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
  resetLayout: () => set({ hiddenMembers: [] }),
}));

export { useToolPrefsStore };
