/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { ASSISTANT_MARK_MS } from './assistant-mark-store.constants';
import type { AssistantMarkState } from './assistant-mark-store.type';

let timer: ReturnType<typeof setTimeout> | undefined;

const useAssistantMarkStore = create<AssistantMarkState>()((set) => ({
  tool: null,
  flash: (tool) => {
    clearTimeout(timer);
    set({ tool });
    timer = setTimeout(() => set({ tool: null }), ASSISTANT_MARK_MS);
  },
  clear: () => {
    clearTimeout(timer);
    set({ tool: null });
  },
}));

export { useAssistantMarkStore };
