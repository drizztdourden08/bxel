/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { SurfaceGuideState } from './surface-guide-store.type';
import { NO_GUIDES } from './surface-guide.constants';
import { withGuideLine } from './with-guide-line';

const useSurfaceGuideStore = create<SurfaceGuideState>()((set) => {
  const change = (key: string, axis: 'x' | 'y', next: (line: readonly number[]) => number[]): void =>
    set((state) => {
      const before = state.guides[key] ?? NO_GUIDES;
      return { guides: { ...state.guides, [key]: withGuideLine(before, axis, next(before[axis])) } };
    });
  return {
    guides: {},
    add: (key, axis, position) => change(key, axis, (line) => [...line, position]),
    move: (key, axis, from, to) => change(key, axis, (line) => line.map((at) => (at === from ? to : at))),
    remove: (key, axis, position) => change(key, axis, (line) => line.filter((at) => at !== position)),
    clear: (key) =>
      set((state) => {
        const { [key]: dropped, ...rest } = state.guides;
        return dropped === undefined ? state : { guides: rest };
      }),
  };
});

export { useSurfaceGuideStore };
