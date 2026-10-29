/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import type { SliceToolState } from './slice-tool-store.type';
import { useDocumentStore } from './useDocumentStore';

const useSliceToolStore = create<SliceToolState>()((set) => ({
  selected: null,
  dialog: null,
  select: (selected) => set({ selected }),
  openDialog: (dialog) => set({ dialog, selected: dialog }),
  closeDialog: () => set({ dialog: null }),
}));

useDocumentStore.subscribe((state, previous) => {
  if (state.activeId !== previous.activeId) useSliceToolStore.setState({ selected: null, dialog: null });
});

export { useSliceToolStore };
