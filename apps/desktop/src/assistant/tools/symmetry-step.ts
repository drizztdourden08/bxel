/* @layer renderer-app @kind logic */
import { useToolStore } from '../../stores/useToolStore';
import type { ViewStep } from './view-steps.type';

const symmetryStep: ViewStep = (patch) => {
  const { symmetry } = patch;
  if (!symmetry) return null;
  const store = useToolStore.getState();
  if (symmetry.x !== undefined && symmetry.x !== store.symmetryX) store.toggleSymmetry('x');
  if (symmetry.y !== undefined && symmetry.y !== useToolStore.getState().symmetryY) store.toggleSymmetry('y');
  if (symmetry.axisX !== undefined) store.setAxis('x', symmetry.axisX);
  if (symmetry.axisY !== undefined) store.setAxis('y', symmetry.axisY);
  return null;
};

export { symmetryStep };
