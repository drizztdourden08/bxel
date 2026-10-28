/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { LivePaintState } from './live-paint-store.type';

const useLivePaintStore = create<LivePaintState>()((set) => ({
  session: null,
  tick: 0,
  start: (session) => set((state) => ({ session, tick: state.tick + 1 })),
  update: () => set((state) => (state.session ? { tick: state.tick + 1 } : state)),
  end: () => set((state) => ({ session: null, tick: state.tick + 1 })),
}));

export { useLivePaintStore };
