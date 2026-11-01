/* @layer renderer-app @kind constants */
import type { DrawingSettings, SymmetryMode } from './drawing-store.type';

const SYMMETRY_TOGGLE: Readonly<Record<SymmetryMode, (state: DrawingSettings) => Partial<DrawingSettings>>> = {
  diagonal: (state) => ({ symmetryDiagonal: !state.symmetryDiagonal }),
  turn: (state) => ({ symmetryTurn: !state.symmetryTurn }),
  tile: (state) => ({ symmetryTile: !state.symmetryTile }),
};

export { SYMMETRY_TOGGLE };
