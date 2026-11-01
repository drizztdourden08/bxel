/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { PresenceState } from './assistant-presence-store.type';

const useAssistantPresenceStore = create<PresenceState>()((set) => ({
  line: null,
  flashes: [],
  show: (line, flashes) => set((state) => ({ line, flashes: [...state.flashes, ...flashes] })),
  endLine: (id) => set((state) => (state.line?.id === id ? { line: null } : state)),
  endFlashes: (id) => set((state) => ({ flashes: state.flashes.filter((flash) => flash.id !== id) })),
}));

export { useAssistantPresenceStore };
