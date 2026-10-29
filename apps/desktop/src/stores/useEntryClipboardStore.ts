/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { EntryClipboardState } from './entry-clipboard-store.type';

const useEntryClipboardStore = create<EntryClipboardState>()((set) => ({
  clip: null,
  hold: (clip) => set({ clip }),
  clear: () => set({ clip: null }),
}));

export { useEntryClipboardStore };
