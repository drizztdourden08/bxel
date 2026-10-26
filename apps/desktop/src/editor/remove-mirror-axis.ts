/* @layer renderer-app @kind logic */
import type { AxisArgs } from '../context-menu/menu-args.type';
import { useToolStore } from '../stores/useToolStore';
import { symmetryOn } from './symmetry-on';

const removeMirrorAxis = (args: Partial<AxisArgs>): void => {
  if (args.axis === undefined) return;
  if (symmetryOn(args.axis)) useToolStore.getState().toggleSymmetry(args.axis);
  useToolStore.getState().setAxis(args.axis, null);
};

export { removeMirrorAxis };
