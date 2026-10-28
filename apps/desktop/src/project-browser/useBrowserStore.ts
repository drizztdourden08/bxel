/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { BrowserState } from './browser-store.type';
import { DEFAULT_VIEW, EMPTY_SELECTION } from './project-browser.constants';

const useBrowserStore = create<BrowserState>()((set) => ({
  ...DEFAULT_VIEW,
  folder: null,
  query: '',
  selection: EMPTY_SELECTION,
  past: [],
  future: [],
  goTo: (folder) =>
    set((state) => (folder === state.folder && state.query === '' ? state : { folder, query: '', selection: EMPTY_SELECTION, past: [...state.past, state.folder].slice(-50), future: [] })),
  goBack: () =>
    set((state) => {
      const previous = state.past.at(-1);
      if (state.past.length === 0) return state;
      return { folder: previous ?? null, query: '', selection: EMPTY_SELECTION, past: state.past.slice(0, -1), future: [state.folder, ...state.future] };
    }),
  goForward: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      return { folder: state.future[0] ?? null, query: '', selection: EMPTY_SELECTION, future: state.future.slice(1), past: [...state.past, state.folder] };
    }),
  setQuery: (query) => set({ query }),
  select: (selection) => set({ selection }),
  setView: (view) => set({ view }),
  setSize: (size) => set({ size }),
  setSort: (sort) => set({ sort }),
  togglePreview: () => set((state) => ({ preview: !state.preview })),
  setPinned: (ids, on) =>
    set((state) => ({ pinned: on ? [...new Set([...state.pinned, ...ids])] : state.pinned.filter((each) => !ids.includes(each)) })),
  addSmart: (name, query) => set((state) => ({ smart: [...state.smart, { id: `smart:${Date.now().toString(36)}`, name, query }] })),
  removeSmart: (id) => set((state) => ({ smart: state.smart.filter((each) => each.id !== id) })),
  load: (saved) => set({ ...saved, query: '', selection: EMPTY_SELECTION, past: [], future: [] }),
  reveal: (folder, id) => set((state) => ({ folder, query: '', selection: { ids: [id], anchor: id }, past: [...state.past, state.folder].slice(-50), future: [] })),
}));

export { useBrowserStore };
