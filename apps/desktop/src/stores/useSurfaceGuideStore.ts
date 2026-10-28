/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { GuideAxis } from '../guides/guide.type';
import type { SurfaceGuideState, ViewGuides } from './surface-guide-store.type';

const EMPTY: ViewGuides = { x: [], y: [] };

const sorted = (values: readonly number[]): number[] => [...new Set(values)].sort((a, b) => a - b);

const withLine = (guides: ViewGuides | undefined, axis: GuideAxis, change: (line: readonly number[]) => number[]): ViewGuides => {
  const base = guides ?? EMPTY;
  return { ...base, [axis]: sorted(change(base[axis])) };
};

const useSurfaceGuideStore = create<SurfaceGuideState>()((set) => ({
  guides: {},
  add: (key, axis, position) => set((state) => ({ guides: { ...state.guides, [key]: withLine(state.guides[key], axis, (line) => [...line, position]) } })),
  move: (key, axis, from, to) =>
    set((state) => ({ guides: { ...state.guides, [key]: withLine(state.guides[key], axis, (line) => line.map((at) => (at === from ? to : at))) } })),
  remove: (key, axis, position) =>
    set((state) => ({ guides: { ...state.guides, [key]: withLine(state.guides[key], axis, (line) => line.filter((at) => at !== position)) } })),
  clear: (key) =>
    set((state) => {
      const { [key]: dropped, ...rest } = state.guides;
      return dropped === undefined ? state : { guides: rest };
    }),
}));

export { useSurfaceGuideStore };
