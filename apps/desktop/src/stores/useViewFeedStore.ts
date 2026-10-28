/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { ViewFeedState } from './view-feed-store.type';

const useViewFeedStore = create<ViewFeedState>()((set) => ({
  view: null,
  source: undefined,
  frame: 0,
  publish: (view, source) => set((state) => ({ view, source, frame: state.frame + 1 })),
}));

export { useViewFeedStore };
