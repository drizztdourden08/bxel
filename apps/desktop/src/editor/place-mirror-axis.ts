/* @layer renderer-app @kind logic */
import type { AxisArgs } from '../context-menu/menu-args.type';
import { useToolStore } from '../stores/useToolStore';
import { axisLength } from './axis-length';
import { snapAxis } from './snap-axis';
import { symmetryOn } from './symmetry-on';

const placeMirrorAxis = (args: Partial<AxisArgs>): void => {
  const length = args.axis === undefined ? null : axisLength(args.axis);
  if (args.axis === undefined || args.position === undefined || length === null) return;
  const tools = useToolStore.getState();
  if (!symmetryOn(args.axis)) tools.toggleSymmetry(args.axis);
  tools.setAxis(args.axis, snapAxis(args.position, length, false));
};

export { placeMirrorAxis };
