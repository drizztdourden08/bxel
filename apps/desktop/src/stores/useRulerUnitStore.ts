/* @layer renderer-app @kind hook */
import { create } from 'zustand';
import { CANVAS_DEFAULTS } from '../canvas-look/canvas-look.constants';
import type { RulerUnitState } from './ruler-unit-store.type';

const useRulerUnitStore = create<RulerUnitState>()((set, get) => ({
  unit: 'pixels',
  tile: CANVAS_DEFAULTS.gridTileSize,
  writer: null,
  sync: (unit, tile) => set({ unit, tile }),
  setWriter: (writer) => set({ writer }),
  choose: (unit) => {
    set({ unit });
    get().writer?.(unit);
  },
}));

export { useRulerUnitStore };
