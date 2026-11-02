/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { TileClockState } from './tile-clock-store.type';

const useTileClockStore = create<TileClockState>()((set) => ({
  paused: false,
  speed: 1,
  setPaused: (paused) => set({ paused }),
  setSpeed: (speed) => set({ speed }),
}));

export { useTileClockStore };
