/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { FileClipboardState } from './file-clipboard-store.type';

const useFileClipboardStore = create<FileClipboardState>()((set) => ({
  clip: null,
  hold: (clip) => set({ clip }),
  clear: () => set({ clip: null }),
}));

export { useFileClipboardStore };
