/* @layer renderer-app @kind logic */
import type { AxisArgs } from '../context-menu/menu-args.type';
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import { snapAxis } from './snap-axis';

const lengthOf = (axis: 'x' | 'y'): number | null => {
  const target = currentTarget();
  if (!target) return null;
  return axis === 'x' ? target.sprite.width : target.sprite.height;
};

const symmetryOn = (axis: 'x' | 'y'): boolean => {
  const tools = useToolStore.getState();
  return axis === 'x' ? tools.symmetryX : tools.symmetryY;
};

const turnOn = (axis: 'x' | 'y'): void => {
  if (!symmetryOn(axis)) useToolStore.getState().toggleSymmetry(axis);
};

const placeMirrorAxis = (args: Partial<AxisArgs>): void => {
  const length = args.axis === undefined ? null : lengthOf(args.axis);
  if (args.axis === undefined || args.position === undefined || length === null) return;
  turnOn(args.axis);
  useToolStore.getState().setAxis(args.axis, snapAxis(args.position, length, false));
};

const centreMirrorAxis = (args: Partial<AxisArgs>): void => {
  const axes = args.axis === undefined ? (['x', 'y'] as const) : [args.axis];
  for (const axis of axes) useToolStore.getState().setAxis(axis, null);
};

const removeMirrorAxis = (args: Partial<AxisArgs>): void => {
  if (args.axis === undefined) return;
  if (symmetryOn(args.axis)) useToolStore.getState().toggleSymmetry(args.axis);
  useToolStore.getState().setAxis(args.axis, null);
};

export { centreMirrorAxis, placeMirrorAxis, removeMirrorAxis };
