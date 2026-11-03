/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { ANGLE_SNAP } from '../editor/transform/transform.constants';
import type { TransformUiState } from './transform-ui-store.type';

const useTransformUiStore = create<TransformUiState>()((set) => ({
  last: null,
  setLast: (last) => set({ last }),
  focus: null,
  grab: null,
  angleSnap: ANGLE_SNAP,
  setAngleSnap: (angleSnap) => set({ angleSnap }),
  mirror: false,
  setMirror: (mirror) => set({ mirror }),
  setFocus: (focus) => set({ focus }),
  setGrab: (grab) => set({ grab }),
}));

export { useTransformUiStore };
