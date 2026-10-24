/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { EMPTY_RULER_VIEW } from '../ruler/ruler.constants';
import type { RulerState } from '../ruler/ruler.type';
import { sameRulerView } from '../ruler/same-ruler-view';

const useRulerStore = create<RulerState>()((set, get) => ({
  ...EMPTY_RULER_VIEW,
  setView: (view) => {
    if (!sameRulerView(get(), view)) set(view);
  },
}));

export { useRulerStore };
