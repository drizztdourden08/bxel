/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { ACTIVITY_MAX } from '../assistant/assistant.constants';
import type { AssistantState } from './assistant-store.type';

const useAssistantStore = create<AssistantState>()((set) => ({
  sessions: [],
  activity: [],
  launch: [],
  pairing: 0,
  opened: {},
  port: null,
  setSessions: (sessions) => set({ sessions }),
  record: (entry) => set((state) => ({ activity: [entry, ...state.activity].slice(0, ACTIVITY_MAX) })),
  setLaunch: (launch) => set({ launch }),
  setPairing: (delta) => set((state) => ({ pairing: Math.max(0, state.pairing + delta) })),
  setPort: (port) => set({ port }),
  markOpened: (documentId) => set((state) => ({ opened: { ...state.opened, [documentId]: true } })),
}));

export { useAssistantStore };
