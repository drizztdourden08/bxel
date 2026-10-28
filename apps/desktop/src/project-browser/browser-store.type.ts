/* @layer renderer-app @kind types */
import type { BrowserSort, BrowserView, SavedBrowserView, SavedFilter, Selection } from './project-browser.type';

interface BrowserState {
  folder: string | null;
  query: string;
  selection: Selection;
  past: readonly (string | null)[];
  future: readonly (string | null)[];
  view: BrowserView;
  size: number;
  sort: BrowserSort;
  preview: boolean;
  pinned: readonly string[];
  smart: readonly SavedFilter[];
  goTo: (folder: string | null) => void;
  goBack: () => void;
  goForward: () => void;
  setQuery: (query: string) => void;
  select: (selection: Selection) => void;
  setView: (view: BrowserView) => void;
  setSize: (size: number) => void;
  setSort: (sort: BrowserSort) => void;
  togglePreview: () => void;
  setPinned: (ids: readonly string[], on: boolean) => void;
  addSmart: (name: string, query: string) => void;
  removeSmart: (id: string) => void;
  load: (saved: SavedBrowserView) => void;
  reveal: (folder: string, id: string) => void;
}

export type { BrowserState };
