/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { AssistantChangedState } from './assistant-changed-store.type';

const useAssistantChangedStore = create<AssistantChangedState>()((set) => ({
  changed: {},
  mark: (ids) => set((state) => ({ changed: { ...state.changed, ...Object.fromEntries(ids.map((id) => [id, true as const])) } })),
  clear: (id) =>
    set((state) => {
      if (!(id in state.changed)) return state;
      return { changed: Object.fromEntries(Object.entries(state.changed).filter(([each]) => each !== id)) };
    }),
}));

export { useAssistantChangedStore };
