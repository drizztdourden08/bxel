/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { AMOUNT_LIMIT, DISTANCE_LIMIT, FIXED_LIMIT, SELECTION_DEFAULTS } from './selection-store.constants';
import type { SelectionState } from './selection-store.type';

const useSelectionStore = create<SelectionState>()((set) => ({
  ...SELECTION_DEFAULTS,
  setVariant: (variant) => set({ variant, vertices: [], draft: null }),
  setMode: (mode) => set({ mode }),
  setConnectivity: (connectivity) => set({ connectivity }),
  setSample: (sample) => set({ sample }),
  setMatch: (match) => set({ match }),
  setDistance: (distance) => set({ distance: Math.max(0, Math.min(DISTANCE_LIMIT, Math.round(distance))) }),
  setIgnoreTransparent: (ignoreTransparent) => set({ ignoreTransparent }),
  setInSelection: (inSelection) => set({ inSelection }),
  setAmount: (amount) => set({ amount: Math.max(1, Math.min(AMOUNT_LIMIT, Math.round(amount))) }),
  setNudge: (nudge) => set({ nudge: Math.max(1, Math.min(AMOUNT_LIMIT, Math.round(nudge))) }),
  setFixed: (fixed) => set({ fixed }),
  setFixedWidth: (fixedWidth) => set({ fixedWidth: Math.max(1, Math.min(FIXED_LIMIT, Math.round(fixedWidth))) }),
  setFixedHeight: (fixedHeight) => set({ fixedHeight: Math.max(1, Math.min(FIXED_LIMIT, Math.round(fixedHeight))) }),
  setMirror: (mirror) => set({ mirror }),
  setQuickMask: (quickMask) => set({ quickMask, draft: null }),
  setMask: (mask, owner) => set({ mask, owner: mask ? owner : null, draft: null, vertices: [] }),
  setDraft: (draft) => set({ draft }),
  setVertices: (vertices) => set({ vertices }),
  setClipboard: (clipboard) => set({ clipboard }),
  setSystemClip: (systemClip) => set({ systemClip }),
}));

export { useSelectionStore };
